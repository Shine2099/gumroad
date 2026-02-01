import { Channel } from "@anycable/web";
import { router } from "@inertiajs/react";
import cx from "classnames";
import { debounce } from "lodash-es";
import * as React from "react";
import { is } from "ts-safe-cast";

import cable from "$app/channels/consumer";
import { assertDefined } from "$app/utils/assert";
import { asyncVoid } from "$app/utils/promise";
import { AbortError } from "$app/utils/request";
import * as Routes from "$app/utils/routes";

import { Button, NavigationButton } from "$app/components/Button";
import { useCurrentSeller } from "$app/components/CurrentSeller";
import { Icon } from "$app/components/Icons";
import { Modal } from "$app/components/Modal";
import { Popover, PopoverContent, PopoverTrigger } from "$app/components/Popover";
import { showAlert } from "$app/components/server-components/Alert";
import { ToggleSettingRow } from "$app/components/SettingRow";
import { Placeholder, PlaceholderImage } from "$app/components/ui/Placeholder";
import { useDebouncedCallback } from "$app/components/useDebouncedCallback";
import { useIsAboveBreakpoint } from "$app/components/useIsAboveBreakpoint";
import { useRunOnce } from "$app/components/useRunOnce";

import { CommunityViewContext, CommunityViewContextType } from "./ChatMessage";
import { ChatMessageInput } from "./ChatMessageInput";
import { ChatMessageList } from "./ChatMessageList";
import { CommunityList } from "./CommunityList";
import { scrollTo } from "./scrollUtils";
import { ScrollToBottomButton } from "./ScrollToBottomButton";
import { DateSeparator } from "./Separator";
import {
  Community,
  CommunityChatMessage,
  CommunityChat,
  CommunityDraft,
  CommunityNotificationSettings,
  CommunitiesPageProps,
  NotificationSettings,
  Seller,
} from "./types";
import { UserAvatar } from "./UserAvatar";

import placeholderImage from "$assets/images/placeholders/community.png";

const COMMUNITY_CHANNEL_NAME = "CommunityChannel";
const USER_CHANNEL_NAME = "UserChannel";

export const MIN_MESSAGE_LENGTH = 1;

type IncomingCommunityChannelMessage =
  | { type: "create_chat_message"; message: CommunityChatMessage }
  | { type: "update_chat_message"; message: CommunityChatMessage }
  | { type: "delete_chat_message"; message: CommunityChatMessage };
type IncomingUserChannelMessage = { type: "latest_community_info"; data: Community };
type OutgoingUserChannelMessage = { type: "latest_community_info"; community_id: string };

const sortByCreatedAt = <T extends { created_at: string }>(items: readonly T[]) =>
  [...items].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

const sortByName = <T extends { name: string }>(items: readonly T[]) =>
  [...items].sort((a, b) => a.name.localeCompare(b.name));

const getComparedTimestamp = (
  prevTimestamp: string | null,
  newTimestamp: string | null,
  comparisonFn: (a: number, b: number) => number,
): string | null => {
  if (!prevTimestamp || !newTimestamp) {
    return newTimestamp === null ? null : newTimestamp;
  }

  const timestampToISOString = new Map<number, string>();
  const prevTime = new Date(prevTimestamp).getTime();
  const newTime = new Date(newTimestamp).getTime();

  timestampToISOString.set(prevTime, prevTimestamp);
  timestampToISOString.set(newTime, newTimestamp);

  const resultTime = comparisonFn(prevTime, newTime);
  return assertDefined(timestampToISOString.get(resultTime));
};

export const CommunityView = ({
  hasProducts,
  communities: initialCommunities,
  notificationSettings: initialNotificationSettings,
  selectedCommunityId,
  initialMessages,
}: CommunitiesPageProps) => {
  const currentSeller = useCurrentSeller();
  const isAboveBreakpoint = useIsAboveBreakpoint("lg");

  // State management
  const [communities, setCommunities] = React.useState<Community[]>(sortByName(initialCommunities));
  const [notificationSettings, setNotificationSettings] =
    React.useState<CommunityNotificationSettings>(initialNotificationSettings);
  const [communityDrafts, setCommunityDrafts] = React.useState<Record<string, CommunityDraft>>({});
  const [communityChats, setCommunityChats] = React.useState<Record<string, CommunityChat>>(() => {
    if (selectedCommunityId && initialMessages) {
      return {
        [selectedCommunityId]: {
          messages: initialMessages.messages,
          nextOlderTimestamp: initialMessages.next_older_timestamp,
          nextNewerTimestamp: initialMessages.next_newer_timestamp,
          isLoading: false,
        },
      };
    }
    return {};
  });

  const selectedCommunity = React.useMemo(
    () => communities.find((community) => community.id === selectedCommunityId),
    [communities, selectedCommunityId],
  );

  const selectedCommunityDraft = React.useMemo(
    () => (selectedCommunity ? communityDrafts[selectedCommunity.id] : null),
    [communityDrafts, selectedCommunity],
  );

  const selectedCommunityChat = React.useMemo(
    () => (selectedCommunity ? communityChats[selectedCommunity.id] : null),
    [communityChats, selectedCommunity],
  );

  const [switcherOpen, setSwitcherOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const [scrollToMessage, setScrollToMessage] = React.useState<{
    id: string;
    position?: ScrollLogicalPosition;
  } | null>(null);
  const [stickyDate, setStickyDate] = React.useState<string | null>(null);
  const chatMessageInputRef = React.useRef<HTMLTextAreaElement>(null);
  const [showScrollToBottomButton, setShowScrollToBottomButton] = React.useState(false);
  const communityChannelsRef = React.useRef<Record<string, Channel>>({});
  const userChannelRef = React.useRef<Channel | null>(null);
  const [chatMessageInputHeight, setChatMessageInputHeight] = React.useState(0);
  const [showNotificationsSettings, setShowNotificationsSettings] = React.useState(false);

  // Update community helper
  const updateCommunity = React.useCallback(
    (communityId: string, value: Partial<Omit<Community, "id" | "seller">>) =>
      setCommunities((prev) => {
        const obj = [...prev];
        const index = obj.findIndex((community) => community.id === communityId);
        if (index !== -1) {
          obj[index] = { ...assertDefined(obj[index]), ...value };
        }
        return obj;
      }),
    [],
  );

  // Update community draft helper
  const updateCommunityDraft = React.useCallback(
    (communityId: string, value: Partial<CommunityDraft>) =>
      setCommunityDrafts((prev) => {
        const obj = { ...prev };
        const draft = obj[communityId] ?? { content: "", isSending: false };
        obj[communityId] = { ...draft, ...value };
        return obj;
      }),
    [],
  );

  // Update community chat helper
  const updateCommunityChat = React.useCallback(
    (
      communityId: string,
      value: Partial<CommunityChat> | ((prev: CommunityChat) => Partial<CommunityChat>),
      { messagesUpdateStrategy }: { messagesUpdateStrategy: "replace" | "merge" },
    ) =>
      setCommunityChats((prev) => {
        const obj = { ...prev };
        const prevChat = obj[communityId] ?? {
          messages: [],
          nextOlderTimestamp: null,
          nextNewerTimestamp: null,
          isLoading: false,
        };
        const { messages: newChatMessages = [], ...newChatExceptMessages } =
          typeof value === "function" ? value(prevChat) : value;

        if (messagesUpdateStrategy === "merge") {
          let messages: CommunityChatMessage[] = [];
          const { messages: prevChatMessages, ...prevChatExceptMessages } = prevChat;

          if (prevChatMessages.length > 0 && newChatMessages.length > 0) {
            const map = new Map<string, CommunityChatMessage>(prevChatMessages.map((message) => [message.id, message]));
            prevChatMessages.forEach((newMessage) => map.set(newMessage.id, newMessage));
            newChatMessages.forEach((newMessage) => {
              const prevMessage = map.get(newMessage.id);
              if (!prevMessage || new Date(prevMessage.updated_at) < new Date(newMessage.updated_at)) {
                map.set(newMessage.id, newMessage);
              }
            });
            messages = [...map.values()];
          } else {
            messages = [...prevChatMessages, ...newChatMessages];
          }

          obj[communityId] = {
            ...prevChatExceptMessages,
            ...newChatExceptMessages,
            messages: sortByCreatedAt(messages),
          };
        } else {
          obj[communityId] = {
            ...prevChat,
            ...newChatExceptMessages,
            messages: sortByCreatedAt(newChatMessages),
          };
        }
        return obj;
      }),
    [],
  );

  // Check for notifications query param
  React.useEffect(() => {
    if (selectedCommunity) {
      const url = new URL(window.location.href);
      if (url.searchParams.has("notifications")) {
        url.searchParams.delete("notifications");
        window.history.replaceState({}, "", url.toString());
        setShowNotificationsSettings(true);
      }
    }
  }, [selectedCommunity]);

  // Mark as read with debounce
  const debouncedMarkAsRead = React.useMemo(
    () =>
      debounce((communityId: string, messageId: string, messageCreatedAt: string) => {
        if (!communityId || !messageId) return;
        router.post(
          Routes.mark_read_chat_messages_path(communityId),
          { message_id: messageId },
          {
            preserveState: true,
            preserveScroll: true,
            only: ["communities"],
            onSuccess: () => {
              updateCommunity(communityId, {
                unread_count: 0, // Will be updated from server
                last_read_community_chat_message_created_at: messageCreatedAt,
              });
            },
            onError: () => {
              showAlert("Failed to mark the message as read. Please try again later.", "error");
            },
          },
        );
      }, 500),
    [updateCommunity],
  );

  const markMessageAsRead = React.useCallback(
    (message: CommunityChatMessage) => {
      if (!selectedCommunity) return;

      // Only mark as read if the message is newer than the last read message
      if (new Date(message.created_at) <= new Date(selectedCommunity.last_read_community_chat_message_created_at ?? 0))
        return;

      debouncedMarkAsRead(selectedCommunity.id, message.id, message.created_at);
    },
    [selectedCommunity, debouncedMarkAsRead],
  );

  React.useEffect(() => {
    if (!selectedCommunityChat || !scrollToMessage) return;
    const exists = selectedCommunityChat.messages.findIndex((message) => message.id === scrollToMessage.id) !== -1;
    if (exists && chatContainerRef.current) {
      scrollTo({
        target: "message",
        messageId: scrollToMessage.id,
        position: scrollToMessage.position ?? "nearest",
      });
      setScrollToMessage(null);
    }
  }, [scrollToMessage, selectedCommunityChat]);

  React.useEffect(() => {
    if (!sidebarOpen) setSidebarOpen(true);
  }, [isAboveBreakpoint]);

  const fetchMessages = async (
    communityId: string,
    { timestamp, fetchType }: { timestamp: string; fetchType: "older" | "newer" | "around" },
    replace = false,
  ) => {
    if (selectedCommunityChat?.isLoading) return;
    updateCommunityChat(communityId, { isLoading: true }, { messagesUpdateStrategy: "merge" });

    return new Promise<void>((resolve, reject) => {
      router.get(
        Routes.chat_messages_path(communityId),
        { timestamp, fetch_type: fetchType },
        {
          preserveState: true,
          preserveScroll: true,
          only: ["messages"],
          onSuccess: (page) => {
            const messagesData = (
              page.props as {
                messages?: {
                  messages: CommunityChatMessage[];
                  next_older_timestamp: string | null;
                  next_newer_timestamp: string | null;
                };
              }
            ).messages;
            if (!messagesData) {
              updateCommunityChat(communityId, { isLoading: false }, { messagesUpdateStrategy: "merge" });
              resolve();
              return;
            }

            if (replace) {
              updateCommunityChat(
                communityId,
                {
                  messages: messagesData.messages,
                  nextOlderTimestamp: messagesData.next_older_timestamp,
                  nextNewerTimestamp: messagesData.next_newer_timestamp,
                  isLoading: false,
                },
                { messagesUpdateStrategy: "replace" },
              );
            } else {
              updateCommunityChat(
                communityId,
                (prev) => {
                  let nextOlderTimestamp = prev.nextOlderTimestamp;
                  let nextNewerTimestamp = prev.nextNewerTimestamp;
                  if (fetchType === "older" || fetchType === "around") {
                    nextOlderTimestamp = getComparedTimestamp(
                      nextOlderTimestamp,
                      messagesData.next_older_timestamp,
                      Math.min,
                    );
                  }
                  if (fetchType === "newer" || fetchType === "around") {
                    nextNewerTimestamp = getComparedTimestamp(
                      nextNewerTimestamp,
                      messagesData.next_newer_timestamp,
                      Math.max,
                    );
                  }

                  return {
                    messages: messagesData.messages,
                    nextOlderTimestamp,
                    nextNewerTimestamp,
                    isLoading: false,
                  };
                },
                { messagesUpdateStrategy: "merge" },
              );
            }

            // Handle scroll to message
            if (messagesData.messages.length > 0 && (fetchType === "older" || fetchType === "newer")) {
              const messages = (replace ? messagesData.messages : selectedCommunityChat?.messages || []).sort(
                (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
              );
              let id;
              let position: ScrollLogicalPosition = "nearest";
              if (fetchType === "older") {
                if (replace) {
                  id = messages[messages.length - 1]?.id;
                  position = "end";
                } else {
                  id = messages[0]?.id;
                  position = "start";
                }
              } else {
                id = messages[messages.length - 1]?.id;
                position = "end";
              }
              setScrollToMessage(id ? { id, position } : null);
            }
            resolve();
          },
          onError: () => {
            updateCommunityChat(communityId, { isLoading: false }, { messagesUpdateStrategy: "merge" });
            reject(new Error("Failed to load messages"));
          },
        },
      );
    });
  };

  // Handle scroll for pagination
  const handleScroll = useDebouncedCallback(() => {
    if (!chatContainerRef.current || !selectedCommunity) return;

    const container = chatContainerRef.current;
    const { scrollTop, scrollHeight, clientHeight } = container;

    if (!selectedCommunityChat) return;

    // Check if we should show the scroll to bottom button
    const scrollPosition = scrollTop + clientHeight;
    const isNearBottom = scrollHeight - scrollPosition < 50;
    setShowScrollToBottomButton(!isNearBottom);

    // When scrolling near the top, load older messages
    if (scrollTop < 100) {
      if (selectedCommunityChat.nextOlderTimestamp && !selectedCommunityChat.isLoading) {
        fetchMessages(selectedCommunity.id, {
          timestamp: selectedCommunityChat.nextOlderTimestamp,
          fetchType: "older",
        }).catch((e: unknown) => {
          if (!(e instanceof AbortError)) showAlert("Failed to load older messages. Please try again later.", "error");
        });
      }
    }

    // When scrolling near the bottom, load newer messages
    if (scrollHeight - scrollTop - clientHeight < 100) {
      if (selectedCommunityChat.nextNewerTimestamp && !selectedCommunityChat.isLoading) {
        fetchMessages(selectedCommunity.id, {
          timestamp: selectedCommunityChat.nextNewerTimestamp,
          fetchType: "newer",
        }).catch((e: unknown) => {
          if (!(e instanceof AbortError)) showAlert("Failed to load newer messages. Please try again later.", "error");
        });
      }
    }
  }, 100);

  // Attach scroll listener
  React.useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
      return () => {
        chatContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  // Insert or update message from WebSocket
  const insertOrUpdateMessage = (message: CommunityChatMessage, isUpdate = false) => {
    updateCommunityChat(message.community_id, { messages: [message] }, { messagesUpdateStrategy: "merge" });

    if (selectedCommunity?.id !== message.community_id || isUpdate) return;

    // Scroll to the message if user is near bottom
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const scrollPosition = scrollTop + clientHeight;
      const isNearBottom = scrollHeight - scrollPosition < 200;

      if (isNearBottom) {
        setScrollToMessage({ id: message.id, position: "start" });
      }
    }
  };

  // Remove message from state
  const removeMessage = (messageId: string, communityId: string) => {
    updateCommunityChat(
      communityId,
      (prev) => ({
        ...prev,
        messages: prev.messages.filter((message) => message.id !== messageId),
      }),
      { messagesUpdateStrategy: "replace" },
    );
  };

  // Send message using Inertia
  const sendMessage = async () => {
    if (!selectedCommunity) return;
    if (!selectedCommunityDraft) return;
    if (selectedCommunityDraft.isSending) return;
    if (selectedCommunityDraft.content.trim() === "") return;

    updateCommunityDraft(selectedCommunity.id, { isSending: true });

    router.post(
      Routes.chat_messages_path(selectedCommunity.id),
      {
        community_chat_message: { content: selectedCommunityDraft.content },
      },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          updateCommunityDraft(selectedCommunity.id, { content: "", isSending: false });
        },
        onError: () => {
          updateCommunityDraft(selectedCommunity.id, { isSending: false });
          showAlert("Failed to send message. Please try again.", "error");
        },
      },
    );
  };

  // Update message using Inertia
  const updateMessage = async (
    messageId: string,
    communityId: string,
    content: string,
  ): Promise<{ message: CommunityChatMessage }> => {
    return new Promise((resolve, reject) => {
      router.put(
        Routes.chat_message_path(communityId, messageId),
        {
          community_chat_message: { content },
        },
        {
          preserveState: true,
          preserveScroll: true,
          onSuccess: () => {
            // Message will be updated via WebSocket
            resolve({ message: { id: messageId, community_id: communityId, content } as CommunityChatMessage });
          },
          onError: () => {
            reject(new Error("Failed to update message"));
          },
        },
      );
    });
  };

  // Delete message using Inertia
  const deleteMessage = async (messageId: string, communityId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      router.delete(Routes.chat_message_path(communityId, messageId), {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          resolve();
        },
        onError: () => {
          reject(new Error("Failed to delete message"));
        },
      });
    });
  };

  const loggedInUser = assertDefined(useCurrentSeller());

  // User channel WebSocket subscription
  React.useEffect(() => {
    if (!cable) return;

    const userChannelState = userChannelRef.current?.state;
    if (userChannelState === "connected" || userChannelState === "idle") return;

    const channel = cable.subscribeTo(USER_CHANNEL_NAME, { user_id: loggedInUser.id });
    userChannelRef.current = channel;

    channel.on("message", (msg) => {
      if (is<IncomingUserChannelMessage>(msg)) {
        updateCommunity(msg.data.id, {
          unread_count: msg.data.unread_count,
          last_read_community_chat_message_created_at: msg.data.last_read_community_chat_message_created_at,
        });
      }
    });

    return () => channel.disconnect();
  }, [cable, loggedInUser]);

  const sendMessageToUserChannel = useDebouncedCallback((msg: OutgoingUserChannelMessage) => {
    const userChannelState = userChannelRef.current?.state;
    if (userChannelState === "connected" || userChannelState === "idle") {
      userChannelRef.current?.send(msg).catch((e: unknown) => {
        // eslint-disable-next-line no-console
        console.error(e);
      });
    }
  }, 100);

  // Community channels WebSocket subscriptions
  React.useEffect(() => {
    communities.forEach((community) => {
      if (!cable) return;
      const communityChannel = communityChannelsRef.current[community.id];
      const communityChannelState = communityChannel?.state;
      if (["connected", "connecting", "idle"].includes(communityChannelState ?? "")) return;
      const channel = cable.subscribeTo(COMMUNITY_CHANNEL_NAME, { community_id: community.id });
      communityChannelsRef.current[community.id] = channel;
      channel.on("message", (msg) => {
        if (is<IncomingCommunityChannelMessage>(msg)) {
          if (msg.type === "create_chat_message") {
            if (msg.message.community_id === community.id) {
              if (community.id === selectedCommunity?.id) {
                insertOrUpdateMessage(msg.message);
              } else {
                // Reset the community chat to force a reload of the messages when switching to a non-selected community with unread messages
                updateCommunityChat(
                  community.id,
                  { messages: [], nextOlderTimestamp: null, nextNewerTimestamp: null },
                  { messagesUpdateStrategy: "replace" },
                );
              }
            }

            sendMessageToUserChannel({ type: "latest_community_info", community_id: community.id });
          } else if (msg.type === "update_chat_message") {
            if (msg.message.community_id === community.id && community.id === selectedCommunity?.id) {
              insertOrUpdateMessage(msg.message, true);
            }
          } else if (msg.message.community_id === community.id) {
            if (community.id === selectedCommunity?.id) {
              removeMessage(msg.message.id, community.id);
            }
            sendMessageToUserChannel({ type: "latest_community_info", community_id: community.id });
          }
        }
      });
    });

    return () => {
      Object.values(communityChannelsRef.current).forEach((channel) => {
        if (channel.state !== "disconnected" && channel.state !== "closed") {
          channel.disconnect();
        }
      });
    };
  }, [cable, selectedCommunity]);

  // Load messages when community is selected
  React.useEffect(() => {
    if (selectedCommunity) {
      const communityMessages = selectedCommunityChat?.messages || [];
      const lastReadMessageCreatedAt = selectedCommunity.last_read_community_chat_message_created_at;
      const shouldFetchMessages =
        communityMessages.length === 0 ||
        (communityMessages.length > 0 &&
          lastReadMessageCreatedAt &&
          communityMessages.findIndex((message) => message.created_at === lastReadMessageCreatedAt) === -1);
      if (shouldFetchMessages) {
        fetchMessages(selectedCommunity.id, {
          fetchType: "around",
          timestamp: lastReadMessageCreatedAt ?? new Date(0).toISOString(),
        }).catch((e: unknown) => {
          if (!(e instanceof AbortError)) showAlert("Failed to load messages. Please try again later.", "error");
        });
      }
    }
  }, [selectedCommunity]);

  // Focus chat input when community changes
  React.useEffect(() => chatMessageInputRef.current?.focus(), [selectedCommunity?.id]);

  // Switch seller/community
  const switchSeller = (sellerId: string) => {
    const community = communities.find((community) => community.seller.id === sellerId);
    if (community) {
      router.visit(Routes.community_path(community.seller.id, community.id), {
        preserveState: true,
        preserveScroll: true,
      });
      setSwitcherOpen(false);
    }
  };

  // Redirect to first community on initial load if no community is selected
  useRunOnce(() => {
    if (selectedCommunity) return;

    const firstCommunity = communities[0];
    if (!firstCommunity) return;

    let communityId;
    if (currentSeller) {
      const community = communities.find((community) => community.seller.id === currentSeller.id);
      if (community) {
        communityId = community.id;
      } else {
        communityId = firstCommunity.id;
      }
    } else {
      communityId = firstCommunity.id;
    }

    const community = communities.find((community) => community.id === communityId);
    if (!community) return;
    window.location.replace(Routes.community_path(community.seller.id, community.id));
  });

  const sellers = React.useMemo(() => {
    const obj = communities.reduce<Record<string, Seller>>((acc, community) => {
      if (!acc[community.seller.id]) {
        acc[community.seller.id] = community.seller;
      }
      return acc;
    }, {});

    return Object.values(obj).sort((a, b) => a.name.localeCompare(b.name));
  }, [communities]);

  const sellersExceptSelected = React.useMemo(
    () => sellers.filter((seller) => seller.id !== selectedCommunity?.seller.id),
    [sellers, selectedCommunity],
  );

  const selectedSellerCommunities = React.useMemo(
    () => communities.filter((community) => community.seller.id === selectedCommunity?.seller.id),
    [communities, selectedCommunity],
  );

  const saveNotificationsSettings = async (community: Community, settings: NotificationSettings) => {
    return new Promise<{ settings: NotificationSettings }>((resolve, reject) => {
      router.put(
        Routes.notification_settings_path(community.id),
        { settings },
        {
          preserveState: true,
          preserveScroll: true,
          onSuccess: () => {
            setNotificationSettings((prev) => ({ ...prev, [community.seller.id]: settings }));
            showAlert("Changes saved!", "success");
            setShowNotificationsSettings(false);
            resolve({ settings });
          },
          onError: () => {
            showAlert("Failed to save changes. Please try again later.", "error");
            reject(new Error("Failed to save settings"));
          },
        },
      );
    });
  };

  const contextValue: CommunityViewContextType = React.useMemo(
    () => ({ markMessageAsRead, updateMessage, deleteMessage }),
    [markMessageAsRead, updateMessage, deleteMessage],
  );

  const scrollToBottom = () => {
    if (selectedCommunity && selectedCommunity.unread_count > 0) {
      fetchMessages(selectedCommunity.id, { fetchType: "older", timestamp: new Date().toISOString() }, true).catch(
        (e: unknown) => {
          if (!(e instanceof AbortError)) showAlert("Failed to load messages. Please try again later.", "error");
        },
      );
    } else {
      scrollTo({ target: "bottom" });
    }
    setShowScrollToBottomButton(false);
  };

  return (
    <CommunityViewContext.Provider value={contextValue}>
      <div className="flex h-screen flex-col">
        <GoBackHeader />

        {communities.length === 0 ? (
          <EmptyCommunitiesPlaceholder hasProducts={hasProducts} />
        ) : selectedCommunity ? (
          <div className="flex flex-1 overflow-hidden">
            <div
              className={cx("flex shrink-0 flex-col overflow-hidden", {
                "relative w-72 border-r dark:border-[rgb(var(--parent-color)/var(--border-alpha))]": isAboveBreakpoint,
                "absolute inset-0 top-12 z-30 bg-gray dark:bg-dark-gray": !isAboveBreakpoint && sidebarOpen,
                "w-0 overflow-hidden": !isAboveBreakpoint && !sidebarOpen,
              })}
              aria-label="Sidebar"
            >
              <div className="flex items-center gap-2 border-b p-2 dark:border-[rgb(var(--parent-color)/var(--border-alpha))]">
                <div className="flex flex-1 items-center gap-2" aria-label="Community switcher area">
                  <UserAvatar
                    src={selectedCommunity.seller.avatar_url}
                    alt={selectedCommunity.seller.name}
                    className="shrink-0 dark:border-[rgb(var(--parent-color)/var(--border-alpha))]"
                  />
                  <div className="flex items-center font-medium">
                    <span className="flex-1 truncate">
                      {currentSeller?.id === selectedCommunity.seller.id
                        ? "My community"
                        : selectedCommunity.seller.name}
                    </span>

                    <Popover open={switcherOpen} onOpenChange={setSwitcherOpen}>
                      <PopoverTrigger aria-label="Switch creator" className="flex h-8 w-8 justify-center">
                        <Icon name="outline-cheveron-down" />
                      </PopoverTrigger>
                      <PopoverContent className="shrink-0 border-0 p-0 shadow-none">
                        <div role="menu">
                          {sellersExceptSelected.map((seller) => (
                            <div
                              key={seller.id}
                              role="menuitem"
                              className="max-w-xs"
                              onClick={() => switchSeller(seller.id)}
                            >
                              <div className="flex items-center gap-1">
                                <UserAvatar
                                  src={seller.avatar_url}
                                  alt={seller.name}
                                  className="shrink-0"
                                  size="small"
                                />
                                <span className="truncate">
                                  {seller.name} {currentSeller?.id === seller.id ? <em>(your community)</em> : null}
                                </span>
                              </div>
                            </div>
                          ))}
                          {sellersExceptSelected.length > 0 ? <hr className="my-1" /> : null}
                          <div role="menuitem" onClick={() => setShowNotificationsSettings(true)}>
                            <Icon name="outline-bell" /> Notifications
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <button
                  onClick={() => setSidebarOpen(false)}
                  className={cx("flex h-8 w-8 cursor-pointer justify-center all-unset", {
                    hidden: isAboveBreakpoint,
                  })}
                  aria-label="Close sidebar"
                >
                  <Icon name="x" className="text-sm" />
                </button>
              </div>

              <CommunityList
                communities={selectedSellerCommunities}
                selectedCommunity={selectedCommunity}
                isAboveBreakpoint={isAboveBreakpoint}
                setSidebarOpen={setSidebarOpen}
              />
            </div>

            <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-black" aria-label="Chat window">
              <CommunityChatHeader
                community={selectedCommunity}
                setSidebarOpen={setSidebarOpen}
                isAboveBreakpoint={isAboveBreakpoint}
              />

              <div className="flex flex-1 overflow-auto">
                <div ref={chatContainerRef} className="relative flex-1 overflow-y-auto">
                  <div
                    className={cx("sticky top-0 z-20 flex justify-center transition-opacity duration-300", {
                      "opacity-100": stickyDate,
                      "opacity-0": !stickyDate,
                    })}
                  >
                    {stickyDate ? <DateSeparator date={stickyDate} showDividerLine={false} /> : null}
                  </div>

                  {selectedCommunityChat ? (
                    <ChatMessageList
                      key={selectedCommunity.id}
                      community={selectedCommunity}
                      data={selectedCommunityChat}
                      setStickyDate={setStickyDate}
                      unreadSeparatorVisibility={showScrollToBottomButton}
                    />
                  ) : null}
                  {showScrollToBottomButton ? (
                    <ScrollToBottomButton
                      hasUnreadMessages={selectedCommunity.unread_count > 0}
                      onClick={scrollToBottom}
                      chatMessageInputHeight={chatMessageInputHeight}
                    />
                  ) : null}
                </div>
              </div>

              <div className="px-6 pb-4">
                <ChatMessageInput
                  draft={selectedCommunityDraft ?? null}
                  updateDraftMessage={(content) => updateCommunityDraft(selectedCommunity.id, { content })}
                  onSend={asyncVoid(sendMessage)}
                  ref={chatMessageInputRef}
                  onHeightChange={setChatMessageInputHeight}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {showNotificationsSettings && selectedCommunity ? (
        <NotificationsSettingsModal
          communityName={selectedCommunity.seller.name}
          settings={notificationSettings[selectedCommunity.seller.id] ?? { recap_frequency: null }}
          onClose={() => setShowNotificationsSettings(false)}
          onSave={(settings) => saveNotificationsSettings(selectedCommunity, settings)}
        />
      ) : null}
    </CommunityViewContext.Provider>
  );
};

const NotificationsSettingsModal = ({
  communityName,
  settings,
  onClose,
  onSave,
}: {
  communityName: string;
  settings: NotificationSettings;
  onClose: () => void;
  onSave: (settings: NotificationSettings) => Promise<{ settings: NotificationSettings }>;
}) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [updatedSettings, setUpdatedSettings] = React.useState<NotificationSettings>(settings);

  return (
    <Modal
      open
      allowClose={false}
      onClose={onClose}
      title="Notifications"
      footer={
        <>
          <Button disabled={isSaving} onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={asyncVoid(async () => {
              setIsSaving(true);
              try {
                await onSave(updatedSettings);
              } catch (_error: unknown) {
                showAlert("Failed to save changes. Please try again later.", "error");
              } finally {
                setIsSaving(false);
              }
            })}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </>
      }
    >
      <p>Receive email recaps of what's happening in "{communityName}" community.</p>
      <ToggleSettingRow
        label="Community recap"
        value={updatedSettings.recap_frequency !== null}
        onChange={(newValue) => setUpdatedSettings({ ...updatedSettings, recap_frequency: newValue ? "weekly" : null })}
        dropdown={
          <div className="radio-buttons flex! flex-col!" role="radiogroup">
            <Button
              role="radio"
              aria-checked={updatedSettings.recap_frequency === "daily"}
              onClick={() => setUpdatedSettings({ ...updatedSettings, recap_frequency: "daily" })}
            >
              <div>
                <h4>Daily</h4>
                <p>Get a summary of activity every day</p>
              </div>
            </Button>
            <Button
              role="radio"
              aria-checked={updatedSettings.recap_frequency === "weekly"}
              onClick={() => setUpdatedSettings({ ...updatedSettings, recap_frequency: "weekly" })}
            >
              <div>
                <h4>Weekly</h4>
                <p>Receive a weekly summary every Sunday</p>
              </div>
            </Button>
          </div>
        }
      />
    </Modal>
  );
};

const CommunityChatHeader = ({
  community,
  setSidebarOpen,
  isAboveBreakpoint,
}: {
  community: Community;
  setSidebarOpen: (open: boolean) => void;
  isAboveBreakpoint: boolean;
}) => (
  <div
    className="m-0 flex justify-between gap-2 border-b px-4 dark:border-[rgb(var(--parent-color)/var(--border-alpha))]"
    aria-label="Community chat header"
  >
    <button
      className={cx("shrink-0 cursor-pointer all-unset", { hidden: isAboveBreakpoint })}
      aria-label="Open sidebar"
      onClick={() => setSidebarOpen(true)}
    >
      <Icon name="outline-cheveron-left" className="text-sm" />
    </button>
    <h1 className="flex-1 truncate py-3 text-base font-bold">{community.name}</h1>
  </div>
);

const GoBackHeader = () => {
  const handleGoBack = (e: React.MouseEvent) => {
    e.preventDefault();
    const referrerUrl = new URL(document.referrer.trim() !== "" ? document.referrer : Routes.dashboard_url());
    window.location.href = referrerUrl.pathname.startsWith("/communities")
      ? Routes.dashboard_path()
      : referrerUrl.toString();
  };

  return (
    <header className="flex h-12 items-center border-b px-4 dark:border-[rgb(var(--parent-color)/var(--border-alpha))]">
      <div className="flex items-center">
        <button
          onClick={handleGoBack}
          className="flex cursor-pointer items-center border-none bg-transparent p-0 text-sm no-underline all-unset"
        >
          <Icon name="arrow-left" className="mr-1" /> Go back
        </button>
      </div>
    </header>
  );
};

const EmptyCommunitiesPlaceholder = ({ hasProducts }: { hasProducts: boolean }) => (
  <div>
    <section>
      <Placeholder>
        <PlaceholderImage src={placeholderImage} />
        <h2>Build your community, one product at a time!</h2>
        <p className="max-w-prose">
          When you publish a product, we automatically create a dedicated community chat—your own space to connect with
          customers, answer questions, and build relationships.
        </p>
        <NavigationButton href={hasProducts ? Routes.products_path() : Routes.new_product_path()} color="accent">
          {hasProducts ? "Enable community chat for your products" : "Create a product with community"}
        </NavigationButton>
        <p>
          or{" "}
          <a href="/help/article/347-gumroad-community" target="_blank" rel="noreferrer">
            learn more about community chats
          </a>
        </p>
      </Placeholder>
    </section>
  </div>
);
