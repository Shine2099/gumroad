# frozen_string_literal: true

require "spec_helper"
require "inertia_rails/rspec"

describe Settings::PasswordController, inertia: true do
  render_views

  let(:user) { create(:user, password: "oldpassword123") }

  before do
    sign_in user
  end

  describe "GET show" do
    before do
      get :show
    end

    it "returns successful response with Inertia page data" do
      expect(response).to be_successful
      expect(inertia.component).to eq("Settings/Password")
      expect(inertia.props[:settings_pages]).to be_an(Array)
      expect(inertia.props[:require_old_password]).to be(true)
    end

    context "when user signed up with OAuth" do
      let(:user) { create(:user, provider: "google") }

      it "does not require old password" do
        get :show
        expect(inertia.props[:require_old_password]).to be(false)
      end
    end
  end

  describe "PUT update" do
    let(:params) do
      {
        user: {
          password: "oldpassword123",
          new_password: "newpassword456"
        }
      }
    end

    it "updates password" do
      put :update, params:, format: :json

      expect(response).to be_successful
      json = JSON.parse(response.body)
      expect(json["success"]).to be(true)

      user.reload
      expect(user.valid_password?("newpassword456")).to be(true)
    end

    context "with incorrect old password" do
      let(:params) do
        {
          user: {
            password: "wrongpassword",
            new_password: "newpassword456"
          }
        }
      end

      it "returns error" do
        put :update, params:, format: :json

        json = JSON.parse(response.body)
        expect(json["success"]).to be(false)
        expect(json["error"]).to include("Incorrect password")
      end
    end
  end
end
