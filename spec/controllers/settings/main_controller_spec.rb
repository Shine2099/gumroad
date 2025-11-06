# frozen_string_literal: true

require "spec_helper"
require "inertia_rails/rspec"

describe Settings::MainController, inertia: true do
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
      expect(inertia.component).to eq("Settings/Main")
      expect(inertia.props[:settings_pages]).to be_an(Array)
      expect(inertia.props[:user]).to include(
        email: user.form_email,
        timezone: user.timezone,
        currency_type: user.currency_type
      )
    end

    it "includes notification settings" do
      expect(inertia.props[:user]).to include(
        enable_payment_email: user.enable_payment_email,
        enable_payment_push_notification: user.enable_payment_push_notification
      )
    end

    it "includes purchasing power parity settings" do
      expect(inertia.props[:user]).to include(
        purchasing_power_parity_enabled: user.purchasing_power_parity_enabled?,
        purchasing_power_parity_limit: user.purchasing_power_parity_limit
      )
    end
  end

  describe "PUT update" do
    let(:params) do
      {
        user: {
          email: user.email,
          enable_payment_email: !user.enable_payment_email,
          purchasing_power_parity_excluded_product_ids: [],
          product_level_support_emails: []
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

  describe "POST resend_confirmation_email" do
    context "when user has unconfirmed email" do
      let(:user) { create(:user, unconfirmed_email: "pending@example.com") }

      it "resends confirmation email and returns success" do
        post :resend_confirmation_email, format: :json

        expect(response).to be_successful
        json = JSON.parse(response.body)
        expect(json["success"]).to be(true)
      end
    end

    context "when user is already confirmed and has no pending email" do
      it "returns failure" do
        post :resend_confirmation_email, format: :json

        expect(response).to be_successful
        json = JSON.parse(response.body)
        expect(json["success"]).to be(false)
      end
    end
  end
end
