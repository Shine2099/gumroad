# frozen_string_literal: true

require "spec_helper"
require "shared_examples/admin_base_controller_concern"

describe Admin::Search::PurchasesController do
  render_views

  it_behaves_like "inherits from Admin::BaseController"

  let(:admin_user) { create(:admin_user) }

  before do
    sign_in admin_user
  end

  describe "#index" do
    let(:email) { "user@example.com" }

    context "when one purchase is found" do
      let(:ip_v4) { "203.0.113.42" }
      let(:purchase_by_email) { create(:purchase, email:) }
      let(:purchase_by_ip) { create(:purchase, ip_address: ip_v4) }

      it "redirects to the admin purchase page when one purchase is found" do
        get :index, params: { query: purchase_by_email.email }
        expect(response).to redirect_to admin_purchase_path(purchase_by_email)

        get :index, params: { query: purchase_by_ip.ip_address }
        expect(response).to redirect_to admin_purchase_path(purchase_by_ip)
      end
    end

    context "when multiple purchases are found" do
      let!(:purchase_1) { create(:purchase, email:) }
      let!(:purchase_2) { create(:gift, gifter_email: email, gifter_purchase: create(:purchase)).gifter_purchase }
      let!(:purchase_3) { create(:gift, giftee_email: email, giftee_purchase: create(:purchase)).giftee_purchase }

      it "returns purchases from Admin::Search::PurchasesService" do
        expect(Admin::Search::PurchasesService).to receive(:new).with(query: email, product_title_query: nil, purchase_status: nil).and_call_original

        get :index, params: { query: email }

        expect(response).to be_successful
        expect(response.body).to include("data-page")
        expect(response.body).to include("Admin/Search/Purchases/Index")

        data_page = response.body.match(/data-page="([^"]+)"/)[1]
        json_object = JSON.parse(CGI.unescapeHTML(data_page))
        props = json_object["props"]

        expect(props["purchases"]).to eq([purchase_1, purchase_2, purchase_3].as_json(admin: true))
        expect(props["query"]).to eq(email)
        expect(props["product_title_query"]).to be_nil
        expect(props["purchase_status"]).to be_nil
        expect(props["pagination"]).to be_present
      end
    end

    describe "product_title_query" do
      let(:product_title_query) { "design" }
      let!(:product) { create(:product, name: "Graphic Design Course") }
      let!(:purchase) { create(:purchase, link: product, email: email) }

      before do
        create(:purchase, link: create(:product, name: "Different Product"))
      end

      context "when query is set" do
        it "filters by product title" do
          # Create another purchase with same email and same product to avoid redirect
          create(:purchase, email: email, link: product)

          expect(Admin::Search::PurchasesService).to receive(:new).with(query: email, product_title_query:, purchase_status: nil).and_call_original

          get :index, params: { query: email, product_title_query: product_title_query }

          expect(response).to be_successful
          expect(response.body).to include("data-page")
          expect(response.body).to include("Admin/Search/Purchases/Index")

          data_page = response.body.match(/data-page="([^"]+)"/)[1]
          json_object = JSON.parse(CGI.unescapeHTML(data_page))
          props = json_object["props"]

          expect(props["purchases"]).to include(purchase.as_json(admin: true))
          expect(props["query"]).to eq(email)
          expect(props["product_title_query"]).to eq(product_title_query)
          expect(props["purchase_status"]).to be_nil
          expect(props["pagination"]).to be_present
        end
      end
    end

    describe "purchase_status" do
      let(:purchase_status) { "successful" }
      let!(:successful_purchase) { create(:purchase, purchase_state: "successful", email: email) }

      before do
        create(:purchase, purchase_state: "failed", email: email)
      end

      context "when query is set" do
        it "filters by purchase status" do
          # Create another purchase with same email and same status to avoid redirect
          create(:purchase, purchase_state: "successful", email: email)

          expect(Admin::Search::PurchasesService).to receive(:new).with(query: email, product_title_query: nil, purchase_status:).and_call_original

          get :index, params: { query: email, purchase_status: purchase_status }

          expect(response).to be_successful
          expect(response.body).to include("data-page")
          expect(response.body).to include("Admin/Search/Purchases/Index")

          data_page = response.body.match(/data-page="([^"]+)"/)[1]
          json_object = JSON.parse(CGI.unescapeHTML(data_page))
          props = json_object["props"]

          expect(props["purchases"]).to include(successful_purchase.as_json(admin: true))
          expect(props["query"]).to eq(email)
          expect(props["product_title_query"]).to be_nil
          expect(props["purchase_status"]).to eq(purchase_status)
          expect(props["pagination"]).to be_present
        end
      end
    end
  end
end
