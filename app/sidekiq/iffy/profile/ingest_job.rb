# frozen_string_literal: true

class Iffy::Profile::IngestJob
  include Sidekiq::Job
  sidekiq_options queue: :long, retry: 3

  def perform(user_id)
    if Sidekiq::Context.current[:queue] != "long" && Feature.active?(:skip_iffy_ingest_jobs)
      raise "Iffy ingest jobs are disabled outside of long queue"
    end

    user = User.find(user_id)

    Iffy::Profile::IngestService.new(user).perform
  end
end
