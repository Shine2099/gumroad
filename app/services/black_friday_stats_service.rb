# frozen_string_literal: true

class BlackFridayStatsService
  BLACK_FRIDAY_CODE = SearchProducts::BLACK_FRIDAY_CODE
  CACHE_KEY = "black_friday_stats"
  CACHE_EXPIRATION = 10.minutes
  AVERAGE_DISCOUNT_LOOKBACK = 30.days

  def self.fetch_stats
    Rails.cache.fetch(CACHE_KEY, expires_in: CACHE_EXPIRATION) do
      calculate_stats
    end
  end

  def self.calculate_stats
    product_ids = fetch_product_ids_with_offer_code
    active_deals_count = product_ids.count
    revenue_cents = fetch_revenue_cents(product_ids)
    average_discount_percentage = calculate_average_discount_percentage

    {
      active_deals_count:,
      revenue_cents:,
      average_discount_percentage:,
    }
  end

  def self.fetch_product_ids_with_offer_code
    search_options = Link.search_options(
      offer_code: BLACK_FRIDAY_CODE,
      size: 10_000,
      _source: false
    )

    Link.search(search_options).results.map(&:_id).map(&:to_i)
  end

  def self.fetch_revenue_cents(product_ids)
    return 0 if product_ids.blank?

    search_options = {
      product: product_ids,
      state: Purchase::NON_GIFT_SUCCESS_STATES,
      exclude_refunded: true,
      exclude_unreversed_chargedback: true,
      size: 0,
      aggs: {
        revenue_total: { sum: { field: "price_cents" } }
      }
    }

    result = PurchaseSearchService.search(search_options)
    result.aggregations.revenue_total.value.to_i
  end

  def self.calculate_average_discount_percentage
    offer_codes = OfferCode
      .alive
      .where(code: BLACK_FRIDAY_CODE)
      .where("created_at >= ?", AVERAGE_DISCOUNT_LOOKBACK.ago)
      .where.not(amount_percentage: nil)

    return 0 if offer_codes.empty?

    total_discount_percentage = offer_codes.sum(:amount_percentage)
    (total_discount_percentage / offer_codes.count.to_f).round
  end
end
