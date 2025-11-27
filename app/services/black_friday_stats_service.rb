# frozen_string_literal: true

class BlackFridayStatsService
  CACHE_KEY = "black_friday_stats"
  CACHE_EXPIRATION = 10.minutes

  class << self
    def fetch_stats
      Rails.cache.fetch(CACHE_KEY, expires_in: CACHE_EXPIRATION) do
        calculate_stats
      end
    end

    def calculate_stats
      black_friday_code = SearchProducts::BLACK_FRIDAY_CODE
      thirty_days_ago = 30.days.ago

      products_by_id = fetch_products_with_offer_code(black_friday_code)
      return default_stats if products_by_id.empty?

      purchase_stats = fetch_purchase_stats(products_by_id.keys, thirty_days_ago)

      default_stats.merge(
        active_deals_count: products_by_id.size,
        revenue_cents: purchase_stats[:total_revenue_cents],
        average_discount_percentage: 0 # We don't want to show the average discount percentage for now
      )
    rescue => e
      # ! NOTE: Given the criticality of the Black Friday period,
      # ! we don't want to risk failing the request if we can't calculate the stats
      # ! so we return the default stats in the worst scenario and they won't be shown in the UI
      Rails.logger.error "Error calculating Black Friday stats: #{e.message}"
      default_stats
    end

    private
      def fetch_products_with_offer_code(code)
        response = Link.search(
          query: {
            bool: {
              must: [
                { term: { "offer_codes.code": code } },
                { term: { is_alive: true } }
              ]
            }
          },
          size: 10_000,
          _source: ["price_cents"],
          track_total_hits: true
        )

        response.response.dig("hits", "hits").to_a.each_with_object({}) do |hit, hash|
          hash[hit["_id"].to_i] = {
            price_cents: hit.dig("_source", "price_cents").to_i
          }
        end
      end

      def fetch_purchase_stats(product_ids, since)
        return { total_revenue_cents: 0, counts_by_product: {} } if product_ids.empty?

        body = {
          query: {
            bool: {
              filter: [
                { terms: { product_id: product_ids } },
                { range: { created_at: { gte: since.iso8601 } } },
                { term: { stripe_refunded: false } },
                { term: { purchase_state: "successful" } }
              ]
            }
          },
          size: 0,
          aggs: {
            total_revenue: { sum: { field: "price_cents" } },
            purchases_by_product: {
              terms: {
                field: "product_id",
                size: [product_ids.size, 10_000].min
              },
              aggs: {
                revenue: { sum: { field: "price_cents" } }
              }
            }
          }
        }

        response = Purchase.search(body)

        counts_by_product = response.aggregations.purchases_by_product.buckets.each_with_object({}) do |bucket, hash|
          hash[bucket["key"].to_i] = bucket["doc_count"]
        end

        {
          total_revenue_cents: response.aggregations.total_revenue.value.to_i,
          counts_by_product:
        }
      end

      def default_stats
        {
          active_deals_count: 0,
          revenue_cents: 0,
          average_discount_percentage: 0
        }
      end
  end
end
