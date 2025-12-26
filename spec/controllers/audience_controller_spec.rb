# frozen_string_literal: true

require "spec_helper"
require "shared_examples/authorize_called"
require "inertia_rails/rspec"

describe AudienceController, inertia: true do
  let(:seller) { create(:named_seller) }

  include_context "with user signed in as admin for seller"

  describe "GET index" do
    it_behaves_like "authorize called for action", :get, :index do
      let(:record) { :audience }
    end

    it "renders Inertia component with zero followers" do
      get :index

      expect(response).to be_successful
      expect_inertia.to render_component("Audience/Index")
      expect(inertia.props[:total_follower_count]).to eq(0)
    end

    it "renders Inertia component with correct follower count" do
      create(:active_follower, user: seller)

      get :index

      expect(response).to be_successful
      expect_inertia.to render_component("Audience/Index")
      expect(inertia.props[:total_follower_count]).to eq(1)
    end

    it "renders Inertia component with audience_data when followers exist" do
      follower = create(:active_follower, user: seller)
      follower.reload

      get :index

      expect(response).to be_successful
      expect(inertia.props[:total_follower_count]).to eq(1)
    end

    it "renders Inertia component with nil audience_data when no followers" do
      get :index

      expect(response).to be_successful
      expect_inertia.to render_component("Audience/Index")
      expect(inertia.props[:total_follower_count]).to eq(0)
      expect(inertia.props[:audience_data]).to be_nil
    end

    it "sets the last viewed dashboard cookie" do
      get :index

      expect(response.cookies["last_viewed_dashboard"]).to eq "audience"
    end
  end

  describe "POST export" do
    it_behaves_like "authorize called for action", :post, :export do
      let(:record) { :audience }
    end

    let!(:follower) { create(:active_follower, user: seller) }
    let(:options) { { "followers" => true, "customers" => false, "affiliates" => false } }

    it "enqueues a job for sending the CSV" do
      post :export, params: { options: options }, as: :json
      expect(Exports::AudienceExportWorker).to have_enqueued_sidekiq_job(seller.id, seller.id, options)

      expect(response).to have_http_status(:ok)
    end

    context "when admin is signed in and impersonates seller" do
      let(:admin_user) { create(:admin_user) }

      before do
        sign_in admin_user
        controller.impersonate_user(seller)
      end

      it "queues sidekiq job for the admin" do
        post :export, params: { options: options }, as: :json
        expect(Exports::AudienceExportWorker).to have_enqueued_sidekiq_job(seller.id, admin_user.id, options)

        expect(response).to have_http_status(:ok)
      end
    end
  end
end
