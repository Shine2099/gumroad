# frozen_string_literal: false

require "spec_helper"
require "inertia_rails/rspec"

describe Purchases::ProductController, type: :controller, inertia: true do
  let(:purchase) { create(:purchase) }

  describe "GET show" do
    it "shows the product for the purchase" do
      get :show, params: { purchase_id: purchase.external_id }

      expect(response).to be_successful
      expect_inertia.to render_component "PurchaseProductPage"

      expected_custom_css = purchase.link.user.seller_profile.custom_styles.to_s
      expect(inertia.props[:custom_css]).to eq(expected_custom_css)
      expect(inertia.props[:product][:id]).to eq(purchase.link.external_id)
    end

    it "404s for an invalid purchase id" do
      expect do
        get :show, params: { purchase_id: "1234" }
      end.to raise_error(ActionController::RoutingError)
    end

    it "adds X-Robots-Tag response header to avoid page indexing" do
      get :show, params: { purchase_id: purchase.external_id }

      expect(response).to be_successful
      expect(response.headers["X-Robots-Tag"]).to eq("noindex")
    end
  end
end
