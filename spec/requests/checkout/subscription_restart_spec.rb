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

    # Stub UpdaterService to avoid real Stripe charges while keeping RestartAtCheckoutService integration
    updater_double = instance_double(Subscription::UpdaterService)
    allow(Subscription::UpdaterService).to receive(:new).and_return(updater_double)
    allow(updater_double).to receive(:perform) do
      Subscription.find(@subscription.id).resubscribe!
      { success: true, success_message: "Your membership has been restarted!" }
    end
  end

  it "restarts the cancelled subscription instead of creating a new one" do
    login_as @buyer
    visit "/checkout?product=#{@product.unique_permalink}&option=#{@tier.external_id}&quantity=1"

    expect(page).to have_cart_item(@product.name)
    fill_checkout_form(@product, logged_in_user: @buyer, email: @buyer.email)

    click_on "Pay", exact: true
    expect(page).to have_text("Your purchase was successful!")

    expect(@subscription.reload).to be_alive
    expect(@subscription.cancelled_at).to be_nil
    expect(@product.subscriptions.count).to eq(1)
  end
end
