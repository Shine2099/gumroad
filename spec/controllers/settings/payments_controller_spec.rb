# frozen_string_literal: true

require "spec_helper"
require "inertia_rails/rspec"

describe Settings::PaymentsController, inertia: true do
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
      expect(inertia.component).to eq("Settings/Payments")
      expect(inertia.props[:settings_pages]).to be_an(Array)
    end

    it "includes payment configuration" do
      expect(inertia.props).to include(
        countries: be_a(Hash),
        bank_account_details: be_a(Hash),
        stripe_connect: be_a(Hash)
      )
    end

    it "includes user payment details" do
      expect(inertia.props[:user]).to be_a(Hash)
    end
  end
end
