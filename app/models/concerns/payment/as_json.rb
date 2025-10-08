# frozen_string_literal: true

module Payment::AsJson
  def as_json(options = {})
    return super(options) if options.delete(:original)
    return as_json_for_admin(options) if options.delete(:admin)

    json = {
      id: external_id,
      amount: format("%.2f", (amount_cents || 0) / 100.0),
      currency: currency,
      status: state,
      created_at: created_at,
      processed_at: state == self.class::COMPLETED ? updated_at : nil,
      payment_processor: processor,
      bank_account_visual: bank_account&.account_number_visual,
      paypal_email: payment_address
    }

    if options[:include_sales]
      json[:sales] = successful_sales.map(&:external_id)
      json[:refunded_sales] = refunded_sales.map(&:external_id)
      json[:disputed_sales] = disputed_sales.map(&:external_id)
    end

    json
  end

  def as_json_for_admin(options = {})
    as_json(
      original: true,
      methods: %i[
        displayed_amount
        humanized_failure_reason
        is_stripe_processor
        is_paypal_processor
        was_created_in_split_mode
        split_payments_info
      ],
      include: {
        bank_account: { only: [], methods: [:formatted_account], include: { credit_card: { only: [:visual] } } },
        user: { original: true, only: [:id, :name] }
      }
    ).merge({
      failed: failed?,
      cancelled: cancelled?,
      returned: returned?,
      processing: processing?,
      created_at_less_than_2_days_ago: created_at <= 2.days.ago,
      unclaimed: unclaimed?,
      non_terminal_state: self.class::NON_TERMINAL_STATES.include?(state)
    }.stringify_keys)
  end
end
