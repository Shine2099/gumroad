import { usePage } from "@inertiajs/react";
import React from "react";
import { cast } from "ts-safe-cast";

import { CommunityView } from "$app/components/Communities/CommunityView";
import type { Community, CommunityChatMessage, CommunityNotificationSettings } from "$app/components/Communities/types";

type Props = {
  has_products: boolean;
  communities: Community[];
  notification_settings: CommunityNotificationSettings;
  selected_community_id: string | null;
  messages: {
    messages: CommunityChatMessage[];
    next_older_timestamp: string | null;
    next_newer_timestamp: string | null;
  } | null;
};

export default function CommunitiesIndex() {
  const props = cast<Props>(usePage().props);

  return (
    <CommunityView
      hasProducts={props.has_products}
      communities={props.communities}
      notificationSettings={props.notification_settings}
      selectedCommunityId={props.selected_community_id}
      initialMessages={props.messages}
    />
  );
}
