# frozen_string_literal: true

class Settings::ThirdPartyAnalyticsController < Settings::BaseController
  before_action :authorize

  def show
    @title = "Settings"

    render inertia: "Settings/ThirdPartyAnalytics", props: {
      third_party_analytics: settings_presenter.third_party_analytics_props,
      settings_pages: settings_presenter.pages,
      products: current_seller.links.alive.map { |product| { permalink: product.unique_permalink, name: product.name } }
    }
  end

  def update
    current_seller.with_lock do
      current_seller.assign_attributes(third_party_analytics_params.except(:snippets))
      ThirdPartyAnalytic.save_third_party_analytics(third_party_analytics_params[:snippets] || [], current_seller)

      if current_seller.save
        render inertia: "Settings/ThirdPartyAnalytics", props: {
          third_party_analytics: settings_presenter.third_party_analytics_props,
          settings_pages: settings_presenter.pages,
          products: current_seller.links.alive.map { |product| { permalink: product.unique_permalink, name: product.name } }
        }, status: :ok
      else
        message = current_seller.errors.full_messages.to_sentence
        redirect_to(
          settings_third_party_analytics_path,
          inertia: { errors: { error_message: message } },
          alert: message,
          status: :see_other
        )
      end
    end
  rescue ThirdPartyAnalytic::ThirdPartyAnalyticInvalid => e
    redirect_to(
      settings_third_party_analytics_path,
      inertia: { errors: { error_message: e.message } },
      alert: e.message,
      status: :see_other
    )
  rescue StandardError => e
    Bugsnag.notify(e)
    message = "Something broke. We're looking into what happened. Sorry about this!"
    redirect_to(
      settings_third_party_analytics_path,
      inertia: { errors: { error_message: message } },
      alert: message,
      status: :see_other
    )
  end

  private
    def third_party_analytics_params
      params.require(:user).permit(
        :disable_third_party_analytics,
        :google_analytics_id,
        :facebook_pixel_id,
        :skip_free_sale_analytics,
        :enable_verify_domain_third_party_services,
        :facebook_meta_tag,
        snippets: [[:id, :code, :location, :name, :product]],
      )
    end

    def authorize
      super([:settings, :third_party_analytics, current_seller])
    end
end
