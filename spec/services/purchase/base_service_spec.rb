# frozen_string_literal: true

require "spec_helper"

describe Purchase::BaseService do
  describe "auto-restart existing subscription on checkout" do
    let(:seller) { create(:user) }
    let(:buyer) { create(:user) }
    let(:product) { create(:membership_product, user: seller) }

    let(:service_class) do
      Class.new(Purchase::BaseService) do
        attr_accessor :purchase

        def initialize(purchase)
          @purchase = purchase
        end

        def perform
          create_subscription(nil)
        end
      end
    end

    describe "when buyer has a deactivated subscription" do
      let!(:existing_purchase) { create(:membership_purchase, link: product, purchaser: buyer) }
      let(:existing_subscription) { existing_purchase.subscription }

      before do
        existing_subscription.update!(user: buyer, deactivated_at: 1.day.ago, failed_at: 1.day.ago)
      end

      let(:new_purchase) do
        purchase = build(:purchase, link: product, purchaser: buyer, email: buyer.email)
        purchase.is_original_subscription_purchase = true
        purchase.price = product.prices.first
        purchase.save!
        purchase
      end

      it "restarts the existing subscription instead of creating a new one" do
        initial_count = product.subscriptions.count

        service_class.new(new_purchase).perform

        expect(product.subscriptions.count).to eq(initial_count)
        expect(new_purchase.reload.subscription).to eq(existing_subscription)
        expect(existing_subscription.reload.deactivated_at).to be_nil
      end

      it "associates the new purchase with the restarted subscription" do
        service_class.new(new_purchase).perform

        expect(existing_subscription.reload.purchases).to include(new_purchase)
      end

      it "does not send restart-specific notifications" do
        expect_any_instance_of(Subscription).not_to receive(:send_restart_notifications!)

        service_class.new(new_purchase).perform
      end
    end

    describe "when subscription was cancelled by seller" do
      let!(:existing_purchase) { create(:membership_purchase, link: product, purchaser: buyer) }
      let(:existing_subscription) { existing_purchase.subscription }

      before do
        existing_subscription.update!(
          user: buyer,
          deactivated_at: 1.day.ago,
          failed_at: 1.day.ago,
          cancelled_at: 2.days.ago,
          cancelled_by_buyer: false
        )
      end

      let(:new_purchase) do
        purchase = build(:purchase, link: product, purchaser: buyer, email: buyer.email)
        purchase.is_original_subscription_purchase = true
        purchase.price = product.prices.first
        purchase.save!
        purchase
      end

      it "creates a new subscription instead of restarting" do
        initial_count = product.subscriptions.count

        service_class.new(new_purchase).perform

        expect(product.subscriptions.count).to eq(initial_count + 1)
        expect(new_purchase.reload.subscription).not_to eq(existing_subscription)
      end
    end

    describe "when subscription was cancelled by buyer" do
      let!(:existing_purchase) { create(:membership_purchase, link: product, purchaser: buyer) }
      let(:existing_subscription) { existing_purchase.subscription }

      before do
        existing_subscription.update!(
          user: buyer,
          deactivated_at: 1.day.ago,
          failed_at: 1.day.ago,
          cancelled_at: 2.days.ago,
          cancelled_by_buyer: true
        )
      end

      let(:new_purchase) do
        purchase = build(:purchase, link: product, purchaser: buyer, email: buyer.email)
        purchase.is_original_subscription_purchase = true
        purchase.price = product.prices.first
        purchase.save!
        purchase
      end

      it "restarts the existing subscription" do
        initial_count = product.subscriptions.count

        service_class.new(new_purchase).perform

        expect(product.subscriptions.count).to eq(initial_count)
        expect(new_purchase.reload.subscription).to eq(existing_subscription)
        expect(existing_subscription.reload.deactivated_at).to be_nil
      end
    end

    describe "when subscription has ended" do
      let!(:existing_purchase) { create(:membership_purchase, link: product, purchaser: buyer) }
      let(:existing_subscription) { existing_purchase.subscription }

      before do
        existing_subscription.update!(user: buyer, deactivated_at: 1.day.ago, failed_at: 1.day.ago, ended_at: Time.current)
      end

      let(:new_purchase) do
        purchase = build(:purchase, link: product, purchaser: buyer, email: buyer.email)
        purchase.is_original_subscription_purchase = true
        purchase.price = product.prices.first
        purchase.save!
        purchase
      end

      it "creates a new subscription instead of restarting" do
        initial_count = product.subscriptions.count

        service_class.new(new_purchase).perform

        expect(product.subscriptions.count).to eq(initial_count + 1)
        expect(new_purchase.reload.subscription).not_to eq(existing_subscription)
      end
    end

    describe "when matching by email without user association" do
      let(:guest_email) { "guest@example.com" }
      let!(:existing_purchase) { create(:membership_purchase, link: product, email: guest_email) }
      let(:existing_subscription) { existing_purchase.subscription }

      before do
        existing_subscription.update!(user: nil, deactivated_at: 1.day.ago, failed_at: 1.day.ago)
      end

      let(:new_purchase) do
        purchase = build(:purchase, link: product, purchaser: nil, email: guest_email)
        purchase.is_original_subscription_purchase = true
        purchase.price = product.prices.first
        purchase.save!
        purchase
      end

      it "restarts the subscription when email matches" do
        initial_count = product.subscriptions.count

        service_class.new(new_purchase).perform

        expect(product.subscriptions.count).to eq(initial_count)
        expect(new_purchase.reload.subscription).to eq(existing_subscription)
        expect(existing_subscription.reload.deactivated_at).to be_nil
      end
    end

    describe "when no matching subscription exists" do
      let(:different_buyer) { create(:user) }

      let(:new_purchase) do
        purchase = build(:purchase, link: product, purchaser: different_buyer, email: different_buyer.email)
        purchase.is_original_subscription_purchase = true
        purchase.price = product.prices.first
        purchase.save!
        purchase
      end

      it "creates a new subscription" do
        expect(product.subscriptions.count).to eq(0)

        service_class.new(new_purchase).perform

        expect(product.subscriptions.count).to eq(1)
        expect(new_purchase.reload.subscription).to be_present
      end
    end

    describe "when multiple deactivated subscriptions exist" do
      let!(:older_purchase) { create(:membership_purchase, link: product, purchaser: buyer) }
      let(:older_subscription) { older_purchase.subscription }
      let!(:newer_purchase) { create(:membership_purchase, link: product, purchaser: buyer) }
      let(:newer_subscription) { newer_purchase.subscription }

      before do
        older_subscription.update!(user: buyer, deactivated_at: 5.days.ago, failed_at: 5.days.ago)
        newer_subscription.update!(user: buyer, deactivated_at: 1.day.ago, failed_at: 1.day.ago)
      end

      let(:new_purchase) do
        purchase = build(:purchase, link: product, purchaser: buyer, email: buyer.email)
        purchase.is_original_subscription_purchase = true
        purchase.price = product.prices.first
        purchase.save!
        purchase
      end

      it "restarts the most recently deactivated subscription" do
        initial_count = product.subscriptions.count

        service_class.new(new_purchase).perform

        expect(product.subscriptions.count).to eq(initial_count)
        expect(new_purchase.reload.subscription).to eq(newer_subscription)
        expect(newer_subscription.reload.deactivated_at).to be_nil
        expect(older_subscription.reload.deactivated_at).to be_present
      end
    end

    describe "when subscription is a test subscription" do
      let!(:existing_purchase) { create(:membership_purchase, link: product, purchaser: buyer) }
      let(:existing_subscription) { existing_purchase.subscription }

      before do
        existing_subscription.update!(user: buyer, deactivated_at: 1.day.ago, failed_at: 1.day.ago, is_test_subscription: true)
      end

      let(:new_purchase) do
        purchase = build(:purchase, link: product, purchaser: buyer, email: buyer.email)
        purchase.is_original_subscription_purchase = true
        purchase.price = product.prices.first
        purchase.save!
        purchase
      end

      it "creates a new subscription instead of restarting the test subscription" do
        initial_count = product.subscriptions.count

        service_class.new(new_purchase).perform

        expect(product.subscriptions.count).to eq(initial_count + 1)
        expect(new_purchase.reload.subscription).not_to eq(existing_subscription)
      end
    end

    describe "when purchase is a test purchase" do
      let!(:existing_purchase) { create(:membership_purchase, link: product, purchaser: seller) }
      let(:existing_subscription) { existing_purchase.subscription }

      before do
        existing_subscription.update!(user: seller, deactivated_at: 1.day.ago, failed_at: 1.day.ago)
      end

      let(:new_purchase) do
        purchase = build(:purchase, link: product, purchaser: seller, email: seller.email)
        purchase.is_original_subscription_purchase = true
        purchase.price = product.prices.first
        purchase.save!
        purchase
      end

      it "creates a new subscription instead of restarting with test purchase" do
        initial_count = product.subscriptions.count

        service_class.new(new_purchase).perform

        expect(product.subscriptions.count).to eq(initial_count + 1)
        expect(new_purchase.reload.subscription).not_to eq(existing_subscription)
      end
    end

    describe "when product is deleted" do
      let!(:existing_purchase) { create(:membership_purchase, link: product, purchaser: buyer) }
      let(:existing_subscription) { existing_purchase.subscription }

      before do
        existing_subscription.update!(user: buyer, deactivated_at: 1.day.ago, failed_at: 1.day.ago)
        product.update!(deleted_at: Time.current)
      end

      let(:new_purchase) do
        purchase = build(:purchase, link: product, purchaser: buyer, email: buyer.email)
        purchase.is_original_subscription_purchase = true
        purchase.price = product.prices.first
        purchase.save!
        purchase
      end

      it "creates a new subscription instead of restarting" do
        initial_count = product.subscriptions.count

        service_class.new(new_purchase).perform

        expect(product.subscriptions.count).to eq(initial_count + 1)
        expect(new_purchase.reload.subscription).not_to eq(existing_subscription)
      end
    end

    describe "when buyer has an active subscription" do
      let!(:existing_purchase) { create(:membership_purchase, link: product, purchaser: buyer) }
      let(:existing_subscription) { existing_purchase.subscription }

      before do
        existing_subscription.update!(user: buyer)
      end

      let(:new_purchase) do
        purchase = build(:purchase, link: product, purchaser: buyer, email: buyer.email)
        purchase.is_original_subscription_purchase = true
        purchase.price = product.prices.first
        purchase.save!
        purchase
      end

      it "associates with existing subscription instead of creating new" do
        initial_count = product.subscriptions.count

        service_class.new(new_purchase).perform

        expect(product.subscriptions.count).to eq(initial_count)
        expect(new_purchase.reload.subscription).to eq(existing_subscription)
      end

      it "updates the credit card on the existing subscription" do
        service_class.new(new_purchase).perform

        expect(existing_subscription.reload.credit_card).to eq(new_purchase.credit_card)
      end
    end

    describe "when subscription has pending cancellation" do
      let!(:existing_purchase) { create(:membership_purchase, link: product, purchaser: buyer) }
      let(:existing_subscription) { existing_purchase.subscription }

      before do
        existing_subscription.update!(
          user: buyer,
          cancelled_at: 1.week.from_now,
          user_requested_cancellation_at: Time.current,
          cancelled_by_buyer: true
        )
      end

      let(:new_purchase) do
        purchase = build(:purchase, link: product, purchaser: buyer, email: buyer.email)
        purchase.is_original_subscription_purchase = true
        purchase.price = product.prices.first
        purchase.save!
        purchase
      end

      it "clears the pending cancellation" do
        expect(existing_subscription.cancelled_at).to be_present

        service_class.new(new_purchase).perform

        existing_subscription.reload
        expect(existing_subscription.cancelled_at).to be_nil
        expect(existing_subscription.user_requested_cancellation_at).to be_nil
      end

      it "associates the new purchase with existing subscription" do
        initial_count = product.subscriptions.count

        service_class.new(new_purchase).perform

        expect(product.subscriptions.count).to eq(initial_count)
        expect(new_purchase.reload.subscription).to eq(existing_subscription)
      end
    end

    describe "when active subscription matches by email only" do
      let(:guest_email) { "guest@example.com" }
      let!(:existing_purchase) { create(:membership_purchase, link: product, email: guest_email) }
      let(:existing_subscription) { existing_purchase.subscription }

      before do
        existing_subscription.update!(user: nil)
      end

      let(:new_purchase) do
        purchase = build(:purchase, link: product, purchaser: nil, email: guest_email)
        purchase.is_original_subscription_purchase = true
        purchase.price = product.prices.first
        purchase.save!
        purchase
      end

      it "associates with existing active subscription via email match" do
        initial_count = product.subscriptions.count

        service_class.new(new_purchase).perform

        expect(product.subscriptions.count).to eq(initial_count)
        expect(new_purchase.reload.subscription).to eq(existing_subscription)
      end
    end

    describe "when multiple active subscriptions exist" do
      let!(:older_purchase) { create(:membership_purchase, link: product, purchaser: buyer) }
      let(:older_subscription) { older_purchase.subscription }
      let!(:newer_purchase) { create(:membership_purchase, link: product, purchaser: buyer) }
      let(:newer_subscription) { newer_purchase.subscription }

      before do
        older_subscription.update!(user: buyer, created_at: 5.days.ago)
        newer_subscription.update!(user: buyer, created_at: 1.day.ago)
      end

      let(:new_purchase) do
        purchase = build(:purchase, link: product, purchaser: buyer, email: buyer.email)
        purchase.is_original_subscription_purchase = true
        purchase.price = product.prices.first
        purchase.save!
        purchase
      end

      it "associates with one of the active subscriptions without creating new" do
        initial_count = product.subscriptions.count

        service_class.new(new_purchase).perform

        expect(product.subscriptions.count).to eq(initial_count)
        expect([older_subscription, newer_subscription]).to include(new_purchase.reload.subscription)
      end
    end

    describe "when restarting a gift subscription" do
      let(:gift_sender) { create(:user) }
      let(:gift_recipient) { buyer }
      let!(:gift_purchase) { create(:membership_purchase, link: product, purchaser: gift_sender, is_gift_sender_purchase: true) }
      let!(:giftee_purchase) { create(:purchase, link: product, purchaser: gift_recipient, email: gift_recipient.email) }
      let(:existing_subscription) { gift_purchase.subscription }

      before do
        existing_subscription.update!(user: gift_recipient, deactivated_at: 1.day.ago, failed_at: 1.day.ago)
        existing_subscription.purchases << giftee_purchase
      end

      let(:new_purchase) do
        purchase = build(:purchase, link: product, purchaser: gift_recipient, email: gift_recipient.email)
        purchase.is_original_subscription_purchase = true
        purchase.price = product.prices.first
        purchase.save!
        purchase
      end

      it "restarts the gift subscription for the recipient" do
        initial_count = product.subscriptions.count

        service_class.new(new_purchase).perform

        expect(product.subscriptions.count).to eq(initial_count)
        expect(new_purchase.reload.subscription).to eq(existing_subscription)
        expect(existing_subscription.reload.deactivated_at).to be_nil
      end
    end

    describe "restart without charge (within billing period)" do
      let!(:existing_purchase) { create(:membership_purchase, link: product, purchaser: buyer) }
      let(:existing_subscription) { existing_purchase.subscription }

      before do
        existing_subscription.update!(
          user: buyer,
          cancelled_at: 1.week.from_now,
          user_requested_cancellation_at: 1.day.ago,
          cancelled_by_buyer: true
        )
      end

      let(:new_purchase) do
        purchase = build(:purchase, link: product, purchaser: buyer, email: buyer.email)
        purchase.is_original_subscription_purchase = true
        purchase.price = product.prices.first
        purchase.existing_subscription_for_restart = existing_subscription
        purchase.is_subscription_restart_without_charge = true
        purchase.save!
        purchase
      end

      it "restarts the subscription without charge and clears cancellation" do
        initial_count = product.subscriptions.count

        service_class.new(new_purchase).perform

        expect(product.subscriptions.count).to eq(initial_count)
        expect(new_purchase.reload.subscription).to eq(existing_subscription)
        existing_subscription.reload
        expect(existing_subscription.cancelled_at).to be_nil
        expect(existing_subscription.user_requested_cancellation_at).to be_nil
        expect(existing_subscription.cancelled_by_buyer).to eq(false)
      end

      it "associates the new purchase with the subscription" do
        service_class.new(new_purchase).perform

        expect(existing_subscription.reload.purchases).to include(new_purchase)
      end
    end

    describe "tier change on restart" do
      let(:tiered_product) { create(:membership_product_with_preset_tiered_pricing, user: seller) }
      let(:tier1) { tiered_product.tiers.first }
      let(:tier2) { tiered_product.tiers.second }

      let!(:existing_purchase) do
        purchase = create(:membership_purchase, link: tiered_product, purchaser: buyer, tier: tier1)
        purchase
      end
      let(:existing_subscription) { existing_purchase.subscription }

      before do
        existing_subscription.update!(user: buyer, deactivated_at: 1.day.ago, failed_at: 1.day.ago)
      end

      let(:new_purchase) do
        purchase = build(:purchase, link: tiered_product, purchaser: buyer, email: buyer.email)
        purchase.is_original_subscription_purchase = true
        purchase.price = tiered_product.prices.first
        purchase.variant_attributes = [tier2]
        purchase.save!
        purchase
      end

      it "updates the subscription to use the new tier" do
        service_class.new(new_purchase).perform

        existing_subscription.reload
        expect(existing_subscription.original_purchase).to eq(new_purchase)
        expect(existing_purchase.reload.is_archived_original_subscription_purchase?).to eq(true)
      end

      it "keeps the same subscription (no new subscription created)" do
        initial_count = tiered_product.subscriptions.count

        service_class.new(new_purchase).perform

        expect(tiered_product.subscriptions.count).to eq(initial_count)
        expect(new_purchase.reload.subscription).to eq(existing_subscription)
      end
    end

    describe "tier change on restart without charge" do
      let(:tiered_product) { create(:membership_product_with_preset_tiered_pricing, user: seller) }
      let(:tier1) { tiered_product.tiers.first }
      let(:tier2) { tiered_product.tiers.second }

      let!(:existing_purchase) do
        purchase = create(:membership_purchase, link: tiered_product, purchaser: buyer, tier: tier1)
        purchase
      end
      let(:existing_subscription) { existing_purchase.subscription }

      before do
        existing_subscription.update!(
          user: buyer,
          cancelled_at: 1.week.from_now,
          user_requested_cancellation_at: 1.day.ago,
          cancelled_by_buyer: true
        )
      end

      let(:new_purchase) do
        purchase = build(:purchase, link: tiered_product, purchaser: buyer, email: buyer.email)
        purchase.is_original_subscription_purchase = true
        purchase.price = tiered_product.prices.first
        purchase.variant_attributes = [tier2]
        purchase.existing_subscription_for_restart = existing_subscription
        purchase.is_subscription_restart_without_charge = true
        purchase.save!
        purchase
      end

      it "updates the subscription tier and clears cancellation" do
        service_class.new(new_purchase).perform

        existing_subscription.reload
        expect(existing_subscription.original_purchase).to eq(new_purchase)
        expect(existing_subscription.cancelled_at).to be_nil
        expect(existing_purchase.reload.is_archived_original_subscription_purchase?).to eq(true)
      end
    end
  end
end
