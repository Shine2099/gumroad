# frozen_string_literal: true

require "spec_helper"

describe Iffy::Product::IngestJob do
  describe "#perform" do
    let(:product) { create(:product) }

    context "when skip_iffy_ingest_jobs feature is active and queue is not long" do
      before do
        allow(Sidekiq::Context).to receive(:current).and_return({ queue: "default" })
        allow(Feature).to receive(:active?).with(:skip_iffy_ingest_jobs).and_return(true)
        allow(Iffy::Product::IngestService).to receive(:new)
      end

      it "raises and does not run the ingest service" do
        expect { described_class.new.perform(product.id) }.to raise_error("Iffy ingest jobs are disabled outside of long queue")
        expect(Iffy::Product::IngestService).not_to have_received(:new)
      end
    end

    context "when skip_iffy_ingest_jobs feature is active and queue is long" do
      before do
        allow(Sidekiq::Context).to receive(:current).and_return({ queue: "long" })
        allow(Feature).to receive(:active?).with(:skip_iffy_ingest_jobs).and_return(true)
      end

      it "does not raise and runs the ingest service" do
        expect(Iffy::Product::IngestService).to receive(:new).with(product).and_call_original
        expect_any_instance_of(Iffy::Product::IngestService).to receive(:perform)

        described_class.new.perform(product.id)
      end
    end

    it "invokes the ingest service with the correct product" do
      expect(Iffy::Product::IngestService).to receive(:new).with(product).and_call_original
      expect_any_instance_of(Iffy::Product::IngestService).to receive(:perform)

      Iffy::Product::IngestJob.new.perform(product.id)
    end
  end
end
