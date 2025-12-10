# frozen_string_literal: true

class Admin::AffiliatesController < Admin::BaseController
  include Pagy::Backend
  include Admin::ListPaginatedUsers

  before_action :fetch_affiliate, only: [:show]

  helper Pagy::UrlHelpers

  def index
    @title = "Affiliate results"

    users = User.admin_search(params[:query])
                .order(created_at: :desc, id: :desc)
                .joins(:direct_affiliate_accounts)
                .distinct

    list_paginated_users users:,
                         template: "Admin/Affiliates/Index",
                         single_result_redirect_path: ->(user) { admin_affiliate_path(user.external_id) }
  end

  def show
    @title = "#{@affiliate_user.display_name} affiliate on Gumroad"
    respond_to do |format|
      format.html do
        render inertia: "Admin/Affiliates/Show",
               props: {
                 user: Admin::UserPresenter::Card.new(user: @affiliate_user, pundit_user:).props,
               }
      end
      format.json { render json: @affiliate_user }
    end
  end

  private
    def fetch_affiliate
      if user = User.find_by(id: params[:external_id])
        return redirect_to admin_affiliate_path(user.external_id)
      end

      @affiliate_user = User.find_by(username: params[:external_id])
      @affiliate_user ||= User.find_by_external_id(params[:external_id].gsub(/^ext-/, ""))

      e404 if @affiliate_user.nil? || @affiliate_user.direct_affiliate_accounts.blank?
    end
end
