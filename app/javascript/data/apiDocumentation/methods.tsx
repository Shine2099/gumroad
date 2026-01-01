import React from "react";

import { CURL_EXAMPLES, RESPONSE_EXAMPLES } from "./examples";
import type { ApiResource } from "./types";

const ResourceSubscriptionsDescription: React.FC = () => (
  <>
    <p>
      Subscribe to a resource. Currently there are 8 supported resource names - "sale", "refund", "dispute",
      "dispute_won", "cancellation", "subscription_updated", "subscription_ended", and "subscription_restarted".
    </p>

    <p>
      <strong>sale</strong> - When subscribed to this resource, you will be notified of the user's sales with an HTTP
      POST to your post_url. The format of the POST is described on the <a href="/ping">Gumroad Ping</a> page.
    </p>

    <p>
      <strong>refund</strong> - When subscribed to this resource, you will be notified of refunds to the user's sales
      with an HTTP POST to your post_url. The format of the POST is same as described on the{" "}
      <a href="/ping">Gumroad Ping</a> page.
    </p>

    <p>
      <strong>dispute</strong> - When subscribed to this resource, you will be notified of the disputes raised against
      user's sales with an HTTP POST to your post_url. The format of the POST is described on the{" "}
      <a href="/ping">Gumroad Ping</a> page.
    </p>

    <p>
      <strong>dispute_won</strong> - When subscribed to this resource, you will be notified of the sale disputes won by
      the user with an HTTP POST to your post_url. The format of the POST is described on the{" "}
      <a href="/ping">Gumroad Ping</a> page.
    </p>

    <p>
      <strong>cancellation</strong> - When subscribed to this resource, you will be notified of cancellations of the
      user's subscribers with an HTTP POST to your post_url.
    </p>

    <p>
      <strong>subscription_updated</strong> - When subscribed to this resource, you will be notified when subscriptions
      to the user's products have been upgraded or downgraded with an HTTP POST to your post_url. A subscription is
      "upgraded" when the subscriber switches to an equally or more expensive tier and/or subscription duration. It is
      "downgraded" when the subscriber switches to a less expensive tier and/or subscription duration. In the case of a
      downgrade, this change will take effect at the end of the current billing period. (Note: This currently applies
      only to tiered membership products, not to all subscription products.)
    </p>

    <p>
      <strong>subscription_ended</strong> - When subscribed to this resource, you will be notified when subscriptions to
      the user's products have ended with an HTTP POST to your post_url. These events include termination of a
      subscription due to: failed payment(s); cancellation; or a subscription of fixed duration ending. Notifications
      are sent at the time the subscription has officially ended, not, for example, at the time cancellation is
      requested.
    </p>

    <p>
      <strong>subscription_restarted</strong> - When subscribed to this resource, you will be notified when
      subscriptions to the user's products have been restarted with an HTTP POST to your post_url. A subscription is
      "restarted" when the subscriber restarts their subscription after previously terminating it.
    </p>

    <p>In each POST request, Gumroad sends these parameters:</p>
    <p>
      <strong>subscription_id</strong>: id of the subscription
      <br />
      <strong>product_id</strong>: id of the product
      <br />
      <strong>product_name</strong>: name of the product
      <br />
      <strong>user_id</strong>: user id of the subscriber
      <br />
      <strong>user_email</strong>: email address of the subscriber
      <br />
      <strong>purchase_ids</strong>: array of charge ids belonging to this subscription
      <br />
      <strong>created_at</strong>: timestamp when subscription was created
      <br />
      <strong>charge_occurrence_count</strong>: number of charges made for this subscription
      <br />
      <strong>recurrence</strong>: subscription duration - monthly/quarterly/biannually/yearly/every_two_years
      <br />
      <strong>free_trial_ends_at</strong>: timestamp when free trial ends, if free trial is enabled for the membership
      <br />
      <strong>custom_fields</strong>: custom fields from the original purchase
      <br />
      <strong>license_key</strong>: license key from the original purchase
    </p>

    <p>
      <em>For "cancellation" resource:</em>
      <br />
      <strong>cancelled</strong>: true if subscription has been cancelled, otherwise false
      <br />
      <strong>cancelled_at</strong>: timestamp at which subscription will be cancelled
      <br />
      <strong>cancelled_by_admin</strong>: true if subscription was been cancelled by admin, otherwise not present
      <br />
      <strong>cancelled_by_buyer</strong>: true if subscription was been cancelled by buyer, otherwise not present
      <br />
      <strong>cancelled_by_seller</strong>: true if subscription was been cancelled by seller, otherwise not present
      <br />
      <strong>cancelled_due_to_payment_failures</strong>: true if subscription was been cancelled automatically because
      of payment failure, otherwise not present
    </p>

    <p>
      <em>For "subscription_updated" resource:</em>
      <br />
      <strong>type</strong>: "upgrade" or "downgrade"
      <br />
      <strong>effective_as_of</strong>: timestamp at which the change went or will go into effect
      <br />
      <strong>old_plan</strong>: tier, subscription duration, price, and quantity of the subscription before the change
      <br />
      <strong>new_plan</strong>: tier, subscription duration, price, and quantity of the subscription after the change
    </p>

    <p>Example</p>
    <pre>
      {`{
  ...
  type: "upgrade",
  effective_as_of: "2021-02-23T16:31:44Z",
  old_plan: {
    tier: { id: "G_-mnBf9b1j9A7a4ub4nFQ==", name: "Basic tier" },
    recurrence: "monthly",
    price_cents: "1000",
    quantity: 1
  },
  new_plan: {
    tier: { id: "G_-mnBf9b1j9A7a4ub4nFQ==", name: "Basic tier" },
    recurrence: "yearly",
    price_cents: "12000",
    quantity: 2
  }
}`}
    </pre>

    <p>
      <em>For "subscription_ended" resource:</em>
      <br />
      <strong>ended_at</strong>: timestamp at which the subscription ended
      <br />
      <strong>ended_reason</strong>: the reason for the subscription ending ("cancelled", "failed_payment", or
      "fixed_subscription_period_ended")
    </p>

    <p>
      <em>For "subscription_restarted" resource:</em>
      <br />
      <strong>restarted_at</strong>: timestamp at which the subscription was restarted
    </p>
  </>
);

export const API_METHODS: ApiResource[] = [
  {
    name: "Products",
    methods: [
      {
        type: "get",
        path: "/products",
        description: "Retrieve all of the existing products for the authenticated user.",
        curlExample: CURL_EXAMPLES.get_products,
        responseExample: RESPONSE_EXAMPLES.products,
      },
      {
        type: "get",
        path: "/products/:id",
        description: "Retrieve the details of a product.",
        curlExample: CURL_EXAMPLES.get_product,
        responseExample: RESPONSE_EXAMPLES.product,
      },
      {
        type: "delete",
        path: "/products/:id",
        description: "Permanently delete a product.",
        curlExample: CURL_EXAMPLES.delete_product,
        responseExample: RESPONSE_EXAMPLES.product_deleted,
      },
      {
        type: "put",
        path: "/products/:id/enable",
        description: "Enable an existing product.",
        curlExample: CURL_EXAMPLES.enable_product,
        responseExample: RESPONSE_EXAMPLES.product,
      },
      {
        type: "put",
        path: "/products/:id/disable",
        description: "Disable an existing product.",
        curlExample: CURL_EXAMPLES.disable_product,
        responseExample: RESPONSE_EXAMPLES.disabled_product,
      },
    ],
  },
  {
    name: "Variant categories",
    methods: [
      {
        type: "post",
        path: "/products/:product_id/variant_categories",
        description: "Create a new variant category on a product.",
        parameters: [
          { name: "variant_category", required: true },
          { name: "title", required: true },
        ],
        curlExample: CURL_EXAMPLES.create_variant_category,
        responseExample: RESPONSE_EXAMPLES.variant_category,
      },
      {
        type: "get",
        path: "/products/:product_id/variant_categories/:id",
        description: "Retrieve the details of a variant category of a product.",
        curlExample: CURL_EXAMPLES.get_variant_category,
        responseExample: RESPONSE_EXAMPLES.variant_category,
      },
      {
        type: "put",
        path: "/products/:product_id/variant_categories/:id",
        description: "Edit a variant category of an existing product.",
        parameters: [
          { name: "variant_category", required: true },
          { name: "title", required: true },
        ],
        curlExample: CURL_EXAMPLES.update_variant_category,
        responseExample: RESPONSE_EXAMPLES.variant_category,
      },
      {
        type: "delete",
        path: "/products/:product_id/variant_categories/:id",
        description: "Permanently delete a variant category of a product.",
        curlExample: CURL_EXAMPLES.delete_variant_category,
        responseExample: RESPONSE_EXAMPLES.variant_category_deleted,
      },
      {
        type: "get",
        path: "/products/:product_id/variant_categories",
        description: "Retrieve all of the existing variant categories of a product.",
        curlExample: CURL_EXAMPLES.get_variant_categories,
        responseExample: RESPONSE_EXAMPLES.variant_categories,
      },
      {
        type: "post",
        path: "/products/:product_id/variant_categories/:variant_category_id/variants",
        description: "Create a new variant of a product.",
        parameters: [
          { name: "name", required: true },
          { name: "price_difference", description: "Optional price difference in cents" },
          { name: "max_purchase_count", description: "Optional max purchase count" },
        ],
        curlExample: CURL_EXAMPLES.create_variant,
        responseExample: RESPONSE_EXAMPLES.variant,
      },
      {
        type: "get",
        path: "/products/:product_id/variant_categories/:variant_category_id/variants/:id",
        description: "Retrieve the details of a variant of a product.",
        curlExample: CURL_EXAMPLES.get_variant,
        responseExample: RESPONSE_EXAMPLES.variant,
      },
      {
        type: "put",
        path: "/products/:product_id/variant_categories/:variant_category_id/variants/:id",
        description: "Edit a variant of an existing product.",
        parameters: [
          { name: "name", required: true },
          { name: "price_difference", description: "Optional price difference in cents" },
          { name: "max_purchase_count", description: "Optional max purchase count" },
        ],
        curlExample: CURL_EXAMPLES.update_variant,
        responseExample: RESPONSE_EXAMPLES.variant,
      },
      {
        type: "delete",
        path: "/products/:product_id/variant_categories/:variant_category_id/variants/:id",
        description: "Permanently delete a variant of a product.",
        curlExample: CURL_EXAMPLES.delete_variant,
        responseExample: RESPONSE_EXAMPLES.variant_deleted,
      },
      {
        type: "get",
        path: "/products/:product_id/variant_categories/:variant_category_id/variants",
        description: "Retrieve all of the existing variants in a variant category.",
        curlExample: CURL_EXAMPLES.get_variants,
        responseExample: RESPONSE_EXAMPLES.variants,
      },
    ],
  },
  {
    name: "Offer codes",
    methods: [
      {
        type: "get",
        path: "/products/:product_id/offer_codes",
        description:
          "Retrieve all of the existing offer codes for a product. Either amount_cents or percent_off will be returned depending if the offer code is a fixed amount off or a percentage off. A universal offer code is one that applies to all products.",
        curlExample: CURL_EXAMPLES.get_offer_codes,
        responseExample: RESPONSE_EXAMPLES.offer_codes,
      },
      {
        type: "get",
        path: "/products/:product_id/offer_codes/:id",
        description: "Retrieve the details of a specific offer code of a product",
        curlExample: CURL_EXAMPLES.get_offer_code,
        responseExample: RESPONSE_EXAMPLES.offer_code,
      },
      {
        type: "post",
        path: "/products/:product_id/offer_codes",
        description:
          "Create a new offer code for a product. Default offer code is in cents. A universal offer code is one that applies to all products.",
        parameters: [
          { name: "name", description: "the coupon code used at checkout", required: true },
          { name: "amount_off", required: true },
          { name: "offer_type", description: 'optional, "cents" or "percent") Default: "cents"' },
          { name: "max_purchase_count", description: "optional" },
          { name: "universal", description: "optional, true or false) Default: false" },
        ],
        curlExample: CURL_EXAMPLES.create_offer_code,
        responseExample: RESPONSE_EXAMPLES.offer_code,
      },
      {
        type: "put",
        path: "/products/:product_id/offer_codes/:id",
        description: "Edit an existing product's offer code.",
        parameters: [
          { name: "name", description: "the coupon code used at checkout" },
          { name: "amount_off" },
          { name: "offer_type", description: 'optional, "cents" or "percent"' },
          { name: "max_purchase_count", description: "optional" },
        ],
        curlExample: CURL_EXAMPLES.update_offer_code,
        responseExample: RESPONSE_EXAMPLES.update_offer_code,
      },
      {
        type: "delete",
        path: "/products/:product_id/offer_codes/:id",
        description: "Permanently delete a product's offer code.",
        curlExample: CURL_EXAMPLES.delete_offer_code,
        responseExample: RESPONSE_EXAMPLES.offer_code_deleted,
      },
    ],
  },
  {
    name: "Custom fields",
    methods: [
      {
        type: "get",
        path: "/products/:product_id/custom_fields",
        description: "Retrieve all of the existing custom fields for a product.",
        curlExample: CURL_EXAMPLES.get_custom_fields,
        responseExample: RESPONSE_EXAMPLES.custom_fields,
      },
      {
        type: "post",
        path: "/products/:product_id/custom_fields",
        description: "Create a new custom field for a product.",
        parameters: [
          { name: "name", required: true },
          { name: "required", description: "optional, true or false" },
        ],
        curlExample: CURL_EXAMPLES.create_custom_field,
        responseExample: RESPONSE_EXAMPLES.custom_field,
      },
      {
        type: "put",
        path: "/products/:product_id/custom_fields/:name",
        description: "Edit an existing product's custom field.",
        parameters: [{ name: "required", description: "optional, true or false" }],
        curlExample: CURL_EXAMPLES.update_custom_field,
        responseExample: RESPONSE_EXAMPLES.custom_field,
      },
      {
        type: "delete",
        path: "/products/:product_id/custom_fields/:name",
        description: "Permanently delete a product's custom field.",
        curlExample: CURL_EXAMPLES.delete_custom_field,
        responseExample: RESPONSE_EXAMPLES.custom_field_deleted,
      },
    ],
  },
  {
    name: "User",
    methods: [
      {
        type: "get",
        path: "/user",
        description: "Retrieve the user's data.",
        curlExample: CURL_EXAMPLES.get_user,
        responseExample: RESPONSE_EXAMPLES.user,
      },
    ],
  },
  {
    name: "Resource subscriptions",
    methods: [
      {
        type: "put",
        path: "/resource_subscriptions",
        description: <ResourceSubscriptionsDescription />,
        parameters: [
          { name: "post_url", required: true },
          { name: "resource_name", required: true },
        ],
        curlExample: CURL_EXAMPLES.create_resource_subscription,
        responseExample: RESPONSE_EXAMPLES.resource_subscription,
      },
      {
        type: "get",
        path: "/resource_subscriptions",
        description: "Show all active subscriptions of user for the input resource.",
        parameters: [{ name: "resource_name", description: "optional" }],
        curlExample: CURL_EXAMPLES.get_resource_subscriptions,
        responseExample: RESPONSE_EXAMPLES.resource_subscriptions,
      },
      {
        type: "delete",
        path: "/resource_subscriptions/:resource_subscription_id",
        description: "Unsubscribe from a resource.",
        curlExample: CURL_EXAMPLES.delete_resource_subscription,
        responseExample: RESPONSE_EXAMPLES.resource_subscription_deleted,
      },
    ],
  },
  {
    name: "Sales",
    methods: [
      {
        type: "get",
        path: "/sales",
        description:
          "Retrieves all of the successful sales by the authenticated user. Available with the 'view_sales' scope.",
        parameters: [
          { name: "after", description: "optional, ISO8601 timestamp" },
          { name: "before", description: "optional, ISO8601 timestamp" },
          { name: "page", description: "optional, page number (default 1)" },
        ],
        curlExample: CURL_EXAMPLES.get_sales,
        responseExample: RESPONSE_EXAMPLES.sales,
      },
      {
        type: "get",
        path: "/sales/:id",
        description: "Retrieves the details of a sale by this user. Available with the 'view_sales' scope.",
        curlExample: CURL_EXAMPLES.get_sale,
        responseExample: RESPONSE_EXAMPLES.sale,
      },
      {
        type: "put",
        path: "/sales/:id/mark_as_shipped",
        description: "Marks a sale as shipped. Available with the 'mark_sales_as_shipped' scope.",
        parameters: [{ name: "tracking_url", description: "optional" }],
        curlExample: CURL_EXAMPLES.mark_sale_as_shipped,
        responseExample: RESPONSE_EXAMPLES.sale_shipped,
      },
      {
        type: "put",
        path: "/sales/:id/refund",
        description: "Refunds a sale. Available with the 'edit_sales' scope.",
        parameters: [{ name: "amount_cents", description: "optional, amount to refund in cents" }],
        curlExample: CURL_EXAMPLES.refund_sale,
        responseExample: RESPONSE_EXAMPLES.sale_refunded,
      },
      {
        type: "post",
        path: "/sales/:id/resend_receipt",
        description: "Resend the purchase receipt to the customer's email. Available with the 'edit_sales' scope.",
        curlExample: CURL_EXAMPLES.resend_receipt,
        responseExample: RESPONSE_EXAMPLES.receipt_resent,
      },
    ],
  },
  {
    name: "Subscribers",
    methods: [
      {
        type: "get",
        path: "/products/:product_id/subscribers",
        description:
          "Retrieves all of the active subscribers for one of the authenticated user's products. Available with the 'view_sales' scope",
        parameters: [{ name: "email", description: "optional, filter by customer email" }],
        curlExample: CURL_EXAMPLES.get_subscribers,
        responseExample: RESPONSE_EXAMPLES.subscribers,
      },
      {
        type: "get",
        path: "/subscribers/:id",
        description:
          "Retrieves the details of a subscriber to this user's product. Available with the 'view_sales' scope.",
        curlExample: CURL_EXAMPLES.get_subscriber,
        responseExample: RESPONSE_EXAMPLES.subscriber,
      },
    ],
  },
  {
    name: "Licenses",
    methods: [
      {
        type: "post",
        path: "/licenses/verify",
        description: "Verify a license",
        parameters: [
          { name: "product_id", required: true },
          { name: "license_key", required: true },
          { name: "increment_uses_count", description: "optional, true or false" },
        ],
        curlExample: CURL_EXAMPLES.verify_license,
        responseExample: RESPONSE_EXAMPLES.license,
      },
      {
        type: "put",
        path: "/licenses/enable",
        description: "Enable a license",
        parameters: [
          { name: "product_id", required: true },
          { name: "license_key", required: true },
        ],
        curlExample: CURL_EXAMPLES.enable_license,
        responseExample: RESPONSE_EXAMPLES.license,
      },
      {
        type: "put",
        path: "/licenses/disable",
        description: "Disable a license",
        parameters: [
          { name: "product_id", required: true },
          { name: "license_key", required: true },
        ],
        curlExample: CURL_EXAMPLES.disable_license,
        responseExample: RESPONSE_EXAMPLES.license,
      },
      {
        type: "put",
        path: "/licenses/decrement_uses_count",
        description: "Decrement the uses count of a license",
        parameters: [
          { name: "product_id", required: true },
          { name: "license_key", required: true },
        ],
        curlExample: CURL_EXAMPLES.decrement_uses_count,
        responseExample: RESPONSE_EXAMPLES.license,
      },
      {
        type: "put",
        path: "/licenses/rotate",
        description: "Rotate a license key. The old license key will no longer be valid.",
        parameters: [
          { name: "product_id", required: true },
          { name: "license_key", required: true },
        ],
        curlExample: CURL_EXAMPLES.rotate_license,
        responseExample: RESPONSE_EXAMPLES.license,
      },
    ],
  },
  {
    name: "Payouts",
    methods: [
      {
        type: "get",
        path: "/payouts",
        description:
          "Retrieves all of the payouts for the authenticated user. Available with the 'view_payouts' scope.",
        parameters: [{ name: "page", description: "optional, page number (default 1)" }],
        curlExample: CURL_EXAMPLES.get_payouts,
        responseExample: RESPONSE_EXAMPLES.payouts,
      },
      {
        type: "get",
        path: "/payouts/:id",
        description:
          "Retrieves the details of a specific payout by this user. Available with the 'view_payouts' scope.",
        curlExample: CURL_EXAMPLES.get_payout,
        responseExample: RESPONSE_EXAMPLES.payout,
      },
    ],
  },
];
