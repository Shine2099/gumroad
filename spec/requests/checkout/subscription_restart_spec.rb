# frozen_string_literal: true

require "spec_helper"

describe "Subscription restart at checkout", :js, type: :system do
  before do
    @seller = create(:named_user)
    @product = create(:membership_product, user: @seller, price_cents: 500)
    @tier = @product.default_tier
    @buyer = create(:user)
    @credit_card = create(:credit_card, user: @buyer)
    @buyer.update!(credit_card: @credit_card)

    @subscription = create(:subscription, link: @product, user: @buyer, credit_card: @credit_card)
    create(:purchase,
           is_original_subscription_purchase: true,
           link: @product,
           subscription: @subscription,
           purchaser: @buyer,
           email: @buyer.email,
           credit_card: @credit_card,
           variant_attributes: [@tier],
           price_cents: @product.price_cents)

    @subscription.update!(cancelled_at: 1.day.ago, deactivated_at: 1.day.ago, cancelled_by_buyer: true)
  end

  it "restarts the cancelled subscription instead of creating a new one" do
    login_as @buyer
    visit @product.long_url
    add_to_cart(@product, option: @tier.name, logged_in_user: @buyer)
    fill_checkout_form(@product, logged_in_user: @buyer, email: @buyer.email)

    expect do
      click_on "Pay", exact: true
      expect(page).to have_alert(text: "Your purchase was successful!", visible: :all)
    end.to not_change { @product.subscriptions.count }

    expect(@subscription.reload).to be_alive
    expect(@subscription.cancelled_at).to be_nil
  end

  context "with a regular product in the cart" do
    before do
      @regular_product = create(:product, user: create(:named_user), price_cents: 1000)
    end

    it "restarts the subscription and purchases the regular product" do
      login_as @buyer
      visit @product.long_url
      add_to_cart(@product, option: @tier.name, logged_in_user: @buyer)

      visit @regular_product.long_url
      add_to_cart(@regular_product)

      fill_checkout_form(@regular_product, logged_in_user: @buyer, email: @buyer.email)

      expect do
        click_on "Pay", exact: true
        expect(page).to have_alert(text: "Your purchase was successful!", visible: :all)
      end.to not_change { @product.subscriptions.count }
        .and change { @regular_product.sales.successful.count }.by(1)

      expect(@subscription.reload).to be_alive
      expect(@subscription.cancelled_at).to be_nil
    end
  end
end
