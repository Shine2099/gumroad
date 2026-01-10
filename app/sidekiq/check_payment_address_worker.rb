# frozen_string_literal: true

class CheckPaymentAddressWorker
  include Sidekiq::Job
  sidekiq_options retry: 0, queue: :default

  SUSPENDED_STATES = %w[suspended_for_tos_violation suspended_for_fraud].freeze

  def perform(user_id)
    user = User.find_by(id: user_id)
    return unless user&.can_flag_for_fraud?

    should_flag = payment_address_matches_suspended_account?(user) ||
                  stripe_fingerprint_matches_suspended_account?(user)

    user.flag_for_fraud!(author_name: "CheckPaymentAddress") if should_flag
  end

  private
    def payment_address_matches_suspended_account?(user)
      return false if user.payment_address.blank?

      banned_accounts_with_same_payment_address = User.where(
        payment_address: user.payment_address,
        user_risk_state: SUSPENDED_STATES
      )

      blocked_email = BlockedObject.find_active_object(user.payment_address)

      banned_accounts_with_same_payment_address.exists? || blocked_email.present?
    end

    def stripe_fingerprint_matches_suspended_account?(user)
      fingerprints = user.alive_bank_accounts.where.not(stripe_fingerprint: [nil, ""]).pluck(:stripe_fingerprint).uniq
      return false if fingerprints.empty?

      suspended_accounts_with_same_fingerprint = BankAccount
        .joins(:user)
        .where(stripe_fingerprint: fingerprints)
        .where.not(user_id: user.id)
        .where(users: { user_risk_state: SUSPENDED_STATES })

      blocked_fingerprints = fingerprints.any? { |fp| BlockedObject.find_active_object(fp).present? }

      suspended_accounts_with_same_fingerprint.exists? || blocked_fingerprints
    end
end
