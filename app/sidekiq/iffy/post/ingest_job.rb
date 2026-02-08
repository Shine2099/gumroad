# frozen_string_literal: true

class Iffy::Post::IngestJob
  include Sidekiq::Job
  sidekiq_options queue: :default, retry: 3

  def perform(post_id)
    if Feature.active?(:skip_iffy_ingest_jobs)
      raise "Iffy ingest jobs are disabled"
    end

    post = Installment.find(post_id)

    Iffy::Post::IngestService.new(post).perform
  end
end
