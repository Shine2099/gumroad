# frozen_string_literal: true

require "spec_helper"

describe Iffy::Post::IngestJob do
  describe "#perform" do
    let(:installment) { create(:installment) }

    context "when skip_iffy_ingest_jobs feature is active and queue is not long" do
      before do
        allow(Sidekiq::Context).to receive(:current).and_return({ queue: "default" })
        allow(Feature).to receive(:active?).with(:skip_iffy_ingest_jobs).and_return(true)
        allow(Iffy::Post::IngestService).to receive(:new)
      end

      it "raises and does not run the ingest service" do
        expect { described_class.new.perform(installment.id) }.to raise_error("Iffy ingest jobs are disabled outside of long queue")
        expect(Iffy::Post::IngestService).not_to have_received(:new)
      end
    end

    context "when skip_iffy_ingest_jobs feature is active and queue is long" do
      before do
        allow(Sidekiq::Context).to receive(:current).and_return({ queue: "long" })
        allow(Feature).to receive(:active?).with(:skip_iffy_ingest_jobs).and_return(true)
      end

      it "does not raise and runs the ingest service" do
        expect(Iffy::Post::IngestService).to receive(:new).with(installment).and_call_original
        expect_any_instance_of(Iffy::Post::IngestService).to receive(:perform)

        described_class.new.perform(installment.id)
      end
    end

    it "invokes the ingest service with the correct installment" do
      expect(Iffy::Post::IngestService).to receive(:new).with(installment).and_call_original
      expect_any_instance_of(Iffy::Post::IngestService).to receive(:perform)

      Iffy::Post::IngestJob.new.perform(installment.id)
    end
  end
end
