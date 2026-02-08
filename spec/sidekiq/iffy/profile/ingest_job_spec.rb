# frozen_string_literal: true

require "spec_helper"

describe Iffy::Profile::IngestJob do
  describe "#perform" do
    let(:user) { create(:user) }

    context "when skip_iffy_ingest_jobs feature is active" do
      before do
        allow(Feature).to receive(:active?).and_return(false)
        allow(Feature).to receive(:active?).with(:skip_iffy_ingest_jobs).and_return(true)
        allow(Iffy::Profile::IngestService).to receive(:new)
      end

      it "raises and does not run the ingest service" do
        expect { described_class.new.perform(user.id) }.to raise_error("Iffy ingest jobs are disabled")
        expect(Iffy::Profile::IngestService).not_to have_received(:new)
      end
    end

    it "invokes the ingest service with the correct user" do
      expect(Iffy::Profile::IngestService).to receive(:new).with(user).and_call_original
      expect_any_instance_of(Iffy::Profile::IngestService).to receive(:perform)

      Iffy::Profile::IngestJob.new.perform(user.id)
    end
  end
end
