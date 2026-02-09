# frozen_string_literal: true

require "spec_helper"

describe Installment, "#workflow_delivery_due?" do
  let(:seller) { create(:user) }
  let(:product) { create(:membership_product, user: seller) }
  let(:workflow) { create(:product_workflow, seller:, link: product, published_at: 1.day.ago) }
  let(:installment) { create(:workflow_installment, workflow:, link: product, published_at: 1.day.ago) }
  let(:purchase) { create(:membership_purchase, link: product, created_at: 30.days.ago) }
  let(:subscription) { purchase.subscription }

  context "when installment is not a workflow installment" do
    let(:installment) { create(:installment, link: product, published_at: 1.day.ago) }

    it "returns true" do
      expect(installment.workflow_delivery_due?(purchase)).to be true
    end
  end

  context "when subscription has not been resubscribed" do
    it "returns true" do
      expect(installment.workflow_delivery_due?(purchase)).to be true
    end
  end

  context "when subscription has been resubscribed" do
    let(:deactivated_at) { 10.days.ago }
    let(:resubscribed_at) { 2.days.ago }

    before do
      subscription.update!(deactivated_at: nil)
      create(:subscription_event, subscription:, event_type: :deactivated, occurred_at: deactivated_at)
      create(:subscription_event, subscription:, event_type: :restarted, occurred_at: resubscribed_at)
    end

    context "when delivery time has passed" do
      before do
        installment.installment_rule.update!(delayed_delivery_time: 1.day.to_i)
      end

      it "returns true" do
        expect(installment.workflow_delivery_due?(purchase)).to be true
      end
    end

    context "when delivery time has not passed" do
      before do
        installment.installment_rule.update!(delayed_delivery_time: 60.days.to_i)
      end

      it "returns false" do
        expect(installment.workflow_delivery_due?(purchase)).to be false
      end
    end
  end

  context "when purchase has no subscription" do
    let(:purchase) { create(:purchase, link: product, created_at: 30.days.ago) }

    it "returns true" do
      expect(installment.workflow_delivery_due?(purchase)).to be true
    end
  end
end
