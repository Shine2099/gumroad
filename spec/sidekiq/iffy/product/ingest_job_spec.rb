# frozen_string_literal: true

require "spec_helper"

describe Iffy::Product::IngestJob do
  describe "#perform" do
    let(:product) { create(:product) }

    context "when skip_iffy_ingest_jobs feature is active" do
      before do
        allow(Feature).to receive(:active?).and_return(false)
        allow(Feature).to receive(:active?).with(:skip_iffy_ingest_jobs).and_return(true)
        allow(Iffy::Product::IngestService).to receive(:new)
      end

      it "raises and does not run the ingest service" do
        expect { described_class.new.perform(product.id) }.to raise_error("Iffy ingest jobs are disabled")
        expect(Iffy::Product::IngestService).not_to have_received(:new)
      end
    end

    it "invokes the ingest service with the correct product" do
      expect(Iffy::Product::IngestService).to receive(:new).with(product).and_call_original
      expect_any_instance_of(Iffy::Product::IngestService).to receive(:perform)

      Iffy::Product::IngestJob.new.perform(product.id)
    end
  end
end
