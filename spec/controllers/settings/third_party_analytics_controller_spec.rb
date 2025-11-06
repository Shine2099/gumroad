# frozen_string_literal: true

require "spec_helper"
require "inertia_rails/rspec"

describe Settings::ThirdPartyAnalyticsController, inertia: true do
  render_views

  let(:user) { create(:user) }

  before do
    sign_in user
  end

  describe "GET show" do
    before do
      get :show
    end

    it "returns successful response with Inertia page data" do
      expect(response).to be_successful
      expect(inertia.component).to eq("Settings/ThirdPartyAnalytics")
      expect(inertia.props[:settings_pages]).to be_an(Array)
    end

    it "includes third party analytics configuration" do
      expect(inertia.props).to include(
        third_party_analytics: be_a(Hash),
        products: be_an(Array)
      )
    end

    it "includes analytics settings" do
      expect(inertia.props[:third_party_analytics]).to include(
        disable_third_party_analytics: be_in([true, false]),
        google_analytics_id: be_a(String),
        facebook_pixel_id: be_a(String),
        snippets: be_an(Array)
      )
    end
  end

  describe "PUT update" do
    let(:params) do
      {
        user: {
          disable_third_party_analytics: false,
          snippets: []
        }
      }
    end

    it "returns JSON response" do
      put :update, params:, format: :json

      expect(response).to be_successful
      json = JSON.parse(response.body)
      expect(json).to have_key("success")
    end
  end
end
