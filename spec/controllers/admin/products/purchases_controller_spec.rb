# frozen_string_literal: true

require "spec_helper"
require "shared_examples/admin_base_controller_concern"

describe Admin::Products::PurchasesController do
  render_views

  it_behaves_like "inherits from Admin::BaseController"

  let(:admin_user) { create(:admin_user) }
  let(:product) { create(:product) }
  let(:purchase_state) { "successful" }
  let(:purchases) { create_list(:purchase, 2, link: product, purchase_state:) }
  let(:ordered_purchases) { purchases.sort_by(&:created_at).reverse }
  let(:page) { nil }
  let(:per_page) { nil }

  before do
    ordered_purchases
    sign_in admin_user
  end

  describe "GET index" do
    it "returns a JSON payload with the purchases" do
      get :index, params: { product_id: product.id }
      expect(response).to be_successful

      payload = JSON.parse(response.body)
      expect(payload["purchases"]).to eq(ordered_purchases.as_json(admin_review: true))
    end

    context "with pagination" do
      let(:page) { 1 }
      let(:per_page) { 1 }
      let(:first_purchase) { ordered_purchases.first }
      let(:last_purchase) { ordered_purchases.last }

      before do
        get :index, params: { product_id: product.id, page:, per_page: }
      end

      it "returns the correctly paginated purchases (page 1)" do
        expect(response).to be_successful

        payload = JSON.parse(response.body)
        expect(payload["purchases"]).to eq([first_purchase].as_json(admin_review: true))
        expect(payload["pagination"]["page"]).to eq(1)
        expect(payload["pagination"]["limit"]).to eq(1)
      end

      it "returns the correctly paginated purchases (page 2)" do
        get :index, params: { product_id: product.id, page: 2, per_page: }
        expect(response).to be_successful

        payload = JSON.parse(response.body)
        expect(payload["purchases"]).to eq([last_purchase].as_json(admin_review: true))
        expect(payload["pagination"]["page"]).to eq(2)
        expect(payload["pagination"]["limit"]).to eq(1)
      end
    end

    context "with purchase status not suitable for admin listing" do
      let(:purchase_state) { "in_progress" }

      before do
        get :index, params: { product_id: product.id }
      end

      it "returns the correctly filtered purchases" do
        expect(response).to be_successful

        payload = JSON.parse(response.body)
        expect(payload["purchases"]).to be_empty
      end
    end
  end
end
