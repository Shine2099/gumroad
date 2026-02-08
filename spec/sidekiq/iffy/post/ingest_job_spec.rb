# frozen_string_literal: true

require "spec_helper"

describe Iffy::Post::IngestJob do
  describe "#perform" do
    let(:installment) { create(:installment) }

    context "when skip_iffy_ingest_jobs feature is active" do
      before do
        allow(Feature).to receive(:active?).and_return(false)
        allow(Feature).to receive(:active?).with(:skip_iffy_ingest_jobs).and_return(true)
        allow(Iffy::Post::IngestService).to receive(:new)
      end

      it "raises and does not run the ingest service" do
        expect { described_class.new.perform(installment.id) }.to raise_error("Iffy ingest jobs are disabled")
        expect(Iffy::Post::IngestService).not_to have_received(:new)
      end
    end

    it "invokes the ingest service with the correct installment" do
      expect(Iffy::Post::IngestService).to receive(:new).with(installment).and_call_original
      expect_any_instance_of(Iffy::Post::IngestService).to receive(:perform)

      Iffy::Post::IngestJob.new.perform(installment.id)
    end
  end
end
