# frozen_string_literal: true

require "spec_helper"
require "shared_examples/admin_base_controller_concern"

describe Admin::Users::PayoutsController do
  it_behaves_like "inherits from Admin::BaseController"

  render_views

  let(:admin_user) { create(:admin_user) }
  let(:admin_user_with_payout_privileges) { create(:admin_user) }

  describe "GET 'index'" do
    let(:user) { create(:user) }
    let!(:payout_1) { create(:payment_completed, user:) }
    let!(:payout_2) { create(:payment_failed, user:) }
    let(:ordered_payouts) { [payout_2, payout_1] }
    let!(:other_user_payout) { create(:payment_failed) }

    it "lists all the payouts for a user" do
      sign_in admin_user
      get :index, params: { user_id: user.id }

      expect(response).to be_successful
      expect(response.body).to include("data-page")
      expect(response.body).to include("Admin/Users/Payouts/Index")

      data_page = response.body.match(/data-page="([^"]+)"/)[1]
      json_object = JSON.parse(CGI.unescapeHTML(data_page))
      props = json_object["props"]

      expect(props["title"]).to eq("Payouts")
      expect(props["user"]).to eq(user.as_json(original: true, only: %i[id]))
      expect(props["payouts"]).to eq(ordered_payouts.as_json(admin: true))
      expect(props["pagination"]).to be_present
    end
  end

  describe "POST 'pause'" do
    let!(:seller) { create(:user) }

    before do
      sign_in admin_user_with_payout_privileges
    end

    it "pauses payouts for seller, sets the pause source as admin, and saves the provided reason" do
      expect(seller.payouts_paused_internally?).to be false
      expect(seller.payouts_paused_by_source).to be nil
      expect(seller.payouts_paused_for_reason).to be nil

      expect do
        post :pause, params: { user_id: seller.id, pause_payouts: { reason: "Chargeback rate too high." } }, format: :json
      end.to change { seller.comments.with_type_payouts_paused.count }.by(1)

      expect(seller.reload.payouts_paused_internally?).to be true
      expect(seller.payouts_paused_by).to eq(admin_user_with_payout_privileges.id)
      expect(seller.payouts_paused_by_source).to eq(User::PAYOUT_PAUSE_SOURCE_ADMIN)
      expect(seller.payouts_paused_for_reason).to eq("Chargeback rate too high.")
    end

    it "pauses payouts for seller and sets the pause source as admin even if no reason is provided" do
      expect(seller.payouts_paused_internally?).to be false
      expect(seller.payouts_paused_by_source).to be nil
      expect(seller.payouts_paused_for_reason).to be nil

      expect do
        post :pause, params: { user_id: seller.id, pause_payouts: { reason: nil } }, format: :json
      end.not_to change { seller.comments.with_type_payouts_paused.count }

      expect(seller.reload.payouts_paused_internally?).to be true
      expect(seller.payouts_paused_by).to eq(admin_user_with_payout_privileges.id)
      expect(seller.payouts_paused_by_source).to eq(User::PAYOUT_PAUSE_SOURCE_ADMIN)
      expect(seller.payouts_paused_for_reason).to be nil
    end
  end

  describe "POST 'resume'" do
    let!(:seller) { create(:user) }
    before do
      seller.update!(payouts_paused_internally: true)
      sign_in admin_user_with_payout_privileges
    end

    it "resumes payouts for seller and clears the payout pause source if payouts are paused by admin" do
      expect(seller.payouts_paused_internally?).to be true
      expect(seller.payouts_paused_by_source).to eq(User::PAYOUT_PAUSE_SOURCE_ADMIN)
      expect(seller.payouts_paused_for_reason).to be nil

      expect do
        post :resume, params: { user_id: seller.id }, format: :json
      end.to change { seller.comments.with_type_payouts_resumed.count }.by(1)

      expect(seller.reload.payouts_paused_internally?).to be false
      expect(seller.payouts_paused_by).to be nil
      expect(seller.payouts_paused_by_source).to be nil
      expect(seller.payouts_paused_for_reason).to be nil
    end

    it "resumes payouts for seller and clears the payout pause source if payouts are paused by stripe" do
      seller.update!(payouts_paused_by: User::PAYOUT_PAUSE_SOURCE_STRIPE)
      expect(seller.reload.payouts_paused_internally?).to be true
      expect(seller.payouts_paused_by_source).to eq(User::PAYOUT_PAUSE_SOURCE_STRIPE)
      expect(seller.payouts_paused_for_reason).to be nil

      expect do
        post :resume, params: { user_id: seller.id }, format: :json
      end.to change { seller.comments.with_type_payouts_resumed.count }.by(1)

      expect(seller.reload.payouts_paused_internally?).to be false
      expect(seller.payouts_paused_by).to be nil
      expect(seller.payouts_paused_by_source).to be nil
      expect(seller.payouts_paused_for_reason).to be nil
    end

    it "resumes payouts for seller and clears the payout pause source if payouts are paused by the system" do
      seller.update!(payouts_paused_by: User::PAYOUT_PAUSE_SOURCE_SYSTEM)
      expect(seller.reload.payouts_paused_internally?).to be true
      expect(seller.payouts_paused_by_source).to eq(User::PAYOUT_PAUSE_SOURCE_SYSTEM)
      expect(seller.payouts_paused_for_reason).to be nil

      expect do
        post :resume, params: { user_id: seller.id }, format: :json
      end.to change { seller.comments.with_type_payouts_resumed.count }.by(1)

      expect(seller.reload.payouts_paused_internally?).to be false
      expect(seller.payouts_paused_by).to be nil
      expect(seller.payouts_paused_by_source).to be nil
      expect(seller.payouts_paused_for_reason).to be nil
    end
  end
end
