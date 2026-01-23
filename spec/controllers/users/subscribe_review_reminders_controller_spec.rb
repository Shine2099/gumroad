# frozen_string_literal: true

require "spec_helper"
require "inertia_rails/rspec"

describe Users::SubscribeReviewRemindersController, type: :controller, inertia: true do
  describe "GET show" do
    let(:user) { create(:user, opted_out_of_review_reminders: true) }

    context "when user is logged in" do
      it "renders Inertia page and sets opted_out_of_review_reminders flag successfully" do
        sign_in(user)
        expect do
          get :show
        end.to change { user.reload.opted_out_of_review_reminders? }.from(true).to(false)
        expect(response).to be_successful
        expect(inertia).to render_component("Users/SubscribeReviewReminders/Show")
        expect(assigns(:title)).to eq("Gumroad")
      end
    end

    context "when user is not logged in" do
      it "redirects to login page" do
        get :show
        expect(response).to redirect_to(login_url(next: user_subscribe_review_reminders_path))
      end
    end
  end
end
