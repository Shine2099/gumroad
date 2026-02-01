# frozen_string_literal: true

class Communities::NotificationSettingsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_community
  after_action :verify_authorized

  def update
    authorize @community, :show?

    settings = current_user.community_notification_settings.find_or_initialize_by(seller: @community.seller)
    settings.update!(permitted_params)

    render json: { settings: CommunityNotificationSettingPresenter.new(settings: settings).props }
  end

  private
    def set_community
      @community = Community.find_by_external_id(params[:community_id])
      e404 unless @community
    end

    def permitted_params
      params.require(:settings).permit(:recap_frequency)
    end
end
