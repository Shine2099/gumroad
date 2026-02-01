# frozen_string_literal: true

class CommunitiesController < ApplicationController
  layout "inertia"
  before_action :authenticate_user!
  after_action :verify_authorized

  def index
    authorize Community

    presenter = CommunitiesPresenter.new(current_user: current_user)

    # Redirect to first community if available
    first_community = presenter.first_community
    if first_community
      redirect_to community_path(first_community.seller.external_id, first_community.external_id)
    else
      render inertia: "Communities/Index", props: communities_props(presenter, nil)
    end
  end

  def show
    authorize Community

    community = Community.find_by_external_id(params[:community_id])
    return e404 unless community

    # Verify user has access to this community
    authorize community, :show?

    presenter = CommunitiesPresenter.new(current_user: current_user)
    render inertia: "Communities/Index", props: communities_props(presenter, community)
  end

  private
    def communities_props(presenter, selected_community)
      {
        has_products: -> { presenter.has_products? },
        communities: -> { presenter.communities_props },
        notification_settings: -> { presenter.notification_settings_props },
        selected_community_id: selected_community&.external_id,
        messages: selected_community ? -> { initial_messages_props(selected_community) } : nil,
      }
    end

    def initial_messages_props(community)
      # Load messages centered on last-read position
      last_read_timestamp = LastReadCommunityChatMessage
        .joins(:community_chat_message)
        .where(user_id: current_user.id, community_id: community.id)
        .pick("community_chat_messages.created_at")&.iso8601 || Time.at(0).iso8601

      PaginatedCommunityChatMessagesPresenter.new(
        community: community,
        timestamp: last_read_timestamp,
        fetch_type: "around"
      ).props
    end

    def set_default_page_title
      set_meta_tag(title: "Communities")
    end
end
