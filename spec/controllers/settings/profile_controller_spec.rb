# frozen_string_literal: true

require "spec_helper"
require "inertia_rails/rspec"

describe Settings::ProfileController, inertia: true do
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
      expect(inertia.component).to eq("Settings/Profile")
      expect(inertia.props[:settings_pages]).to be_an(Array)
    end

    it "includes profile props" do
      expect(inertia.props).to have_key(:settings_pages)
    end
  end

  describe "PUT update" do
    let(:params) do
      {
        user: {
          name: "New Name"
        }
      }
    end

    it "updates user profile" do
      put :update, params:, format: :json

      expect(response).to be_successful
      user.reload
      expect(user.name).to eq("New Name")
    end

    context "when user is not confirmed" do
      let(:user) { create(:user, confirmed_at: nil) }

      it "returns error" do
        put :update, params:, format: :json

        expect(response).to be_successful
        json = JSON.parse(response.body)
        expect(json["success"]).to be(false)
        expect(json["error_message"]).to include("confirm your email")
      end
    end
  end
end
