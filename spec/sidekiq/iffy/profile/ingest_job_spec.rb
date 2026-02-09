# frozen_string_literal: true

require "spec_helper"

describe Iffy::Profile::IngestJob do
  describe "#perform" do
    let(:user) { create(:user) }

    context "when skip_iffy_ingest_jobs feature is active and queue is not long" do
      before do
        allow(Sidekiq::Context).to receive(:current).and_return({ queue: "default" })
        allow(Feature).to receive(:active?).with(:skip_iffy_ingest_jobs).and_return(true)
        allow(Iffy::Profile::IngestService).to receive(:new)
      end

      it "raises and does not run the ingest service" do
        expect { described_class.new.perform(user.id) }.to raise_error("Iffy ingest jobs are disabled outside of long queue")
        expect(Iffy::Profile::IngestService).not_to have_received(:new)
      end
    end

    context "when skip_iffy_ingest_jobs feature is active and queue is long" do
      before do
        allow(Sidekiq::Context).to receive(:current).and_return({ queue: "long" })
        allow(Feature).to receive(:active?).with(:skip_iffy_ingest_jobs).and_return(true)
      end

      it "does not raise and runs the ingest service" do
        expect(Iffy::Profile::IngestService).to receive(:new).with(user).and_call_original
        expect_any_instance_of(Iffy::Profile::IngestService).to receive(:perform)

        described_class.new.perform(user.id)
      end
    end

    it "invokes the ingest service with the correct user" do
      expect(Iffy::Profile::IngestService).to receive(:new).with(user).and_call_original
      expect_any_instance_of(Iffy::Profile::IngestService).to receive(:perform)

      Iffy::Profile::IngestJob.new.perform(user.id)
    end
  end
end
