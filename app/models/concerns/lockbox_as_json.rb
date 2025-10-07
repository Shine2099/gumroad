# frozen_string_literal: true

module LockboxAsJson
  def as_json(options = {})
    options[:except] ||= []

    if lock_options.present?
      options[:except] |= lock_options.keys
      Rails.logger.warn("⚠️ Warning: the following fields are being used by Lockbox for encryption and are excluded by default from the JSON output: #{lock_options.keys.join(", ")}")
    end

    super(options)
  end
end
