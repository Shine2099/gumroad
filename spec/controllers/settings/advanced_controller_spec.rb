# frozen_string_literal: true

require "spec_helper"
require "inertia_rails/rspec"

describe Settings::AdvancedController, inertia: true do
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
      expect(inertia.component).to eq("Settings/Advanced")
      expect(inertia.props[:settings_pages]).to be_an(Array)
    end

    it "includes advanced settings" do
      expect(inertia.props).to include(
        notification_endpoint: be_a(String),
        blocked_customer_emails: be_a(String),
        custom_domain_name: be_a(String),
        applications: be_an(Array)
      )
    end
  end

  describe "PUT update" do
    let(:params) do
      {
        user: {
          notification_endpoint: "https://example.com/webhook"
        }
      }
    end

    it "updates advanced settings" do
      put :update, params:, format: :json

      expect(response).to be_successful
      json = JSON.parse(response.body)
      expect(json["success"]).to be(true)

      user.reload
      expect(user.notification_endpoint).to eq("https://example.com/webhook")
    end
  end
end
