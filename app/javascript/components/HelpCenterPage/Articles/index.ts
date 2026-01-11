import * as React from "react";

export type ArticleComponent = React.ComponentType;

export interface ArticleModule {
  component: ArticleComponent;
  description: string;
}

type ArticleLoader = () => Promise<ArticleModule>;

const articles: Record<string, ArticleLoader> = {
  "10-dealing-with-vat": () =>
    import("./DealingWithVat").then((m) => ({
      component: m.default,
      description: m.DealingWithVatDescription,
    })),
  "101-designing-your-product-page": () =>
    import("./DesigningYourProductPage").then((m) => ({
      component: m.default,
      description: m.DesigningYourProductPageDescription,
    })),
  "107-common-zapier-integrations-with-gumroad": () =>
    import("./CommonZapierIntegrationsWithGumroad").then((m) => ({
      component: m.default,
      description: m.CommonZapierIntegrationsWithGumroadDescription,
    })),
  "110-gumroads-subprocessors": () =>
    import("./GumroadsSubprocessors").then((m) => ({
      component: m.default,
      description: m.GumroadsSubprocessorsDescription,
    })),
  "112-mobile-friendly-files": () =>
    import("./MobileFriendlyFiles").then((m) => ({
      component: m.default,
      description: m.MobileFriendlyFilesDescription,
    })),
  "120-protecting-your-privacy-on-gumroad": () =>
    import("./ProtectingYourPrivacyOnGumroad").then((m) => ({
      component: m.default,
      description: m.ProtectingYourPrivacyOnGumroadDescription,
    })),
  "121-sales-tax-on-gumroad": () =>
    import("./SalesTaxOnGumroad").then((m) => ({
      component: m.default,
      description: m.SalesTaxOnGumroadDescription,
    })),
  "124-your-gumroad-profile-page": () =>
    import("./YourGumroadProfilePage").then((m) => ({
      component: m.default,
      description: m.YourGumroadProfilePageDescription,
    })),
  "125-how-to-compress-a-video-using-handbrake": () =>
    import("./HowToCompressAVideoUsingHandbrake").then((m) => ({
      component: m.default,
      description: m.HowToCompressAVideoUsingHandbrakeDescription,
    })),
  "126-setting-up-versions-on-a-digital-product": () =>
    import("./SettingUpVersionsOnADigitalProduct").then((m) => ({
      component: m.default,
      description: m.SettingUpVersionsOnADigitalProductDescription,
    })),
  "128-discount-codes": () =>
    import("./DiscountCodes").then((m) => ({
      component: m.default,
      description: m.DiscountCodesDescription,
    })),
  "13-getting-paid": () =>
    import("./GettingPaid").then((m) => ({
      component: m.default,
      description: m.GettingPaidDescription,
    })),
  "130-pdf-stamping": () =>
    import("./PdfStamping").then((m) => ({
      component: m.default,
      description: m.PdfStampingDescription,
    })),
  "131-using-workflows-to-send-automated-updates": () =>
    import("./UsingWorkflowsToSendAutomatedUpdates").then((m) => ({
      component: m.default,
      description: m.UsingWorkflowsToSendAutomatedUpdatesDescription,
    })),
  "133-pay-what-you-want-pricing": () =>
    import("./PayWhatYouWantPricing").then((m) => ({
      component: m.default,
      description: m.PayWhatYouWantPricingDescription,
    })),
  "134-how-does-gumroad-handle-chargebacks": () =>
    import("./HowDoesGumroadHandleChargebacks").then((m) => ({
      component: m.default,
      description: m.HowDoesGumroadHandleChargebacksDescription,
    })),
  "136-find-your-products-url": () =>
    import("./FindYourProductsUrl").then((m) => ({
      component: m.default,
      description: m.FindYourProductsUrlDescription,
    })),
  "139-how-to-cancel-your-customers-subscriptions": () =>
    import("./HowToCancelYourCustomersSubscriptions").then((m) => ({
      component: m.default,
      description: m.HowToCancelYourCustomersSubscriptionsDescription,
    })),
  "144-send-customers-directly-to-your-payment-form": () =>
    import("./SendCustomersDirectlyToYourPaymentForm").then((m) => ({
      component: m.default,
      description: m.SendCustomersDirectlyToYourPaymentFormDescription,
    })),
  "149-adding-a-product": () =>
    import("./AddingAProduct").then((m) => ({
      component: m.default,
      description: m.AddingAProductDescription,
    })),
  "15-1099s": () =>
    import("./Article1099s").then((m) => ({
      component: m.default,
      description: m.Article1099sDescription,
    })),
  "153-setting-up-a-custom-domain": () =>
    import("./SettingUpACustomDomain").then((m) => ({
      component: m.default,
      description: m.SettingUpACustomDomainDescription,
    })),
  "155-things-you-cant-sell-on-gumroad": () =>
    import("./ThingsYouCantSellOnGumroad").then((m) => ({
      component: m.default,
      description: m.ThingsYouCantSellOnGumroadDescription,
    })),
  "156-gumroad-and-adult-content": () =>
    import("./GumroadAndAdultContent").then((m) => ({
      component: m.default,
      description: m.GumroadAndAdultContentDescription,
    })),
  "160-suspension": () =>
    import("./Suspension").then((m) => ({
      component: m.default,
      description: m.SuspensionDescription,
    })),
  "161-what-gumroad-considers-fraud": () =>
    import("./WhatGumroadConsidersFraud").then((m) => ({
      component: m.default,
      description: m.WhatGumroadConsidersFraudDescription,
    })),
  "169-how-to-send-an-update": () =>
    import("./HowToSendAnUpdate").then((m) => ({
      component: m.default,
      description: m.HowToSendAnUpdateDescription,
    })),
  "170-audience": () =>
    import("./Audience").then((m) => ({
      component: m.default,
      description: m.AudienceDescription,
    })),
  "174-third-party-analytics": () =>
    import("./ThirdPartyAnalytics").then((m) => ({
      component: m.default,
      description: m.ThirdPartyAnalyticsDescription,
    })),
  "176-metadata-for-audio-files": () =>
    import("./MetadataForAudioFiles").then((m) => ({
      component: m.default,
      description: m.MetadataForAudioFilesDescription,
    })),
  "177-the-gumroad-dashboard-app": () =>
    import("./TheGumroadDashboardApp").then((m) => ({
      component: m.default,
      description: m.TheGumroadDashboardAppDescription,
    })),
  "189-safe-gumroad-buying": () =>
    import("./SafeGumroadBuying").then((m) => ({
      component: m.default,
      description: m.SafeGumroadBuyingDescription,
    })),
  "190-how-do-i-get-a-refund": () =>
    import("./HowDoIGetARefund").then((m) => ({
      component: m.default,
      description: m.HowDoIGetARefundDescription,
    })),
  "191-a-guide-to-buying-on-gumroad": () =>
    import("./AGuideToBuyingOnGumroad").then((m) => ({
      component: m.default,
      description: m.AGuideToBuyingOnGumroadDescription,
    })),
  "192-how-do-i-cancel-my-membership": () =>
    import("./HowDoICancelMyMembership").then((m) => ({
      component: m.default,
      description: m.HowDoICancelMyMembershipDescription,
    })),
  "193-my-purchase-isnt-downloading": () =>
    import("./MyPurchaseIsntDownloading").then((m) => ({
      component: m.default,
      description: m.MyPurchaseIsntDownloadingDescription,
    })),
  "194-i-need-an-invoice": () =>
    import("./INeedAnInvoice").then((m) => ({
      component: m.default,
      description: m.INeedAnInvoiceDescription,
    })),
  "195-theres-an-issue-with-my-purchase": () =>
    import("./TheresAnIssueWithMyPurchase").then((m) => ({
      component: m.default,
      description: m.TheresAnIssueWithMyPurchaseDescription,
    })),
  "196-contact-gumroad": () =>
    import("./ContactGumroad").then((m) => ({
      component: m.default,
      description: m.ContactGumroadDescription,
    })),
  "197-why-do-i-have-a-1-charge-from-gumroad": () =>
    import("./WhyDoIHaveA1ChargeFromGumroad").then((m) => ({
      component: m.default,
      description: m.WhyDoIHaveA1ChargeFromGumroadDescription,
    })),
  "198-your-gumroad-library": () =>
    import("./YourGumroadLibrary").then((m) => ({
      component: m.default,
      description: m.YourGumroadLibraryDescription,
    })),
  "199-how-do-i-access-my-purchase": () =>
    import("./HowDoIAccessMyPurchase").then((m) => ({
      component: m.default,
      description: m.HowDoIAccessMyPurchaseDescription,
    })),
  "20-how-do-i-contact-gumroad": () =>
    import("./HowDoIContactGumroad").then((m) => ({
      component: m.default,
      description: m.HowDoIContactGumroadDescription,
    })),
  "200-i-need-a-vat-refund": () =>
    import("./INeedAVatRefund").then((m) => ({
      component: m.default,
      description: m.INeedAVatRefundDescription,
    })),
  "203-why-did-my-payment-fail": () =>
    import("./WhyDidMyPaymentFail").then((m) => ({
      component: m.default,
      description: m.WhyDidMyPaymentFailDescription,
    })),
  "204-get-to-know-your-gumroad-receipt": () =>
    import("./GetToKnowYourGumroadReceipt").then((m) => ({
      component: m.default,
      description: m.GetToKnowYourGumroadReceiptDescription,
    })),
  "206-how-to-open-zip-and-rar-files": () =>
    import("./HowToOpenZipAndRarFiles").then((m) => ({
      component: m.default,
      description: m.HowToOpenZipAndRarFilesDescription,
    })),
  "208-how-do-i-send-my-gumroad-purchase-to-my-kindle": () =>
    import("./HowDoISendMyGumroadPurchaseToMyKindle").then((m) => ({
      component: m.default,
      description: m.HowDoISendMyGumroadPurchaseToMyKindleDescription,
    })),
  "209-how-do-i-combine-two-accounts": () =>
    import("./HowDoICombineTwoAccounts").then((m) => ({
      component: m.default,
      description: m.HowDoICombineTwoAccountsDescription,
    })),
  "210-send-your-purchase-to-dropbox": () =>
    import("./SendYourPurchaseToDropbox").then((m) => ({
      component: m.default,
      description: m.SendYourPurchaseToDropboxDescription,
    })),
  "211-im-not-receiving-updates": () =>
    import("./ImNotReceivingUpdates").then((m) => ({
      component: m.default,
      description: m.ImNotReceivingUpdatesDescription,
    })),
  "212-i-never-received-a-receipt": () =>
    import("./INeverReceivedAReceipt").then((m) => ({
      component: m.default,
      description: m.INeverReceivedAReceiptDescription,
    })),
  "213-how-do-i-give-a-product-as-a-gift": () =>
    import("./HowDoIGiveAProductAsAGift").then((m) => ({
      component: m.default,
      description: m.HowDoIGiveAProductAsAGiftDescription,
    })),
  "214-why-was-i-charged-by-gumroad": () =>
    import("./WhyWasIChargedByGumroad").then((m) => ({
      component: m.default,
      description: m.WhyWasIChargedByGumroadDescription,
    })),
  "215-when-will-my-purchase-be-shipped": () =>
    import("./WhenWillMyPurchaseBeShipped").then((m) => ({
      component: m.default,
      description: m.WhenWillMyPurchaseBeShippedDescription,
    })),
  "216-delete-credit-card-information": () =>
    import("./DeleteCreditCardInformation").then((m) => ({
      component: m.default,
      description: m.DeleteCreditCardInformationDescription,
    })),
  "217-i-have-extra-charges-from-gumroad-after-my-purchase": () =>
    import("./IHaveExtraChargesFromGumroadAfterMyPurchase").then((m) => ({
      component: m.default,
      description: m.IHaveExtraChargesFromGumroadAfterMyPurchaseDescription,
    })),
  "222-product-ratings-on-gumroad": () =>
    import("./ProductRatingsOnGumroad").then((m) => ({
      component: m.default,
      description: m.ProductRatingsOnGumroadDescription,
    })),
  "223-payoneer-and-gumroad": () =>
    import("./PayoneerAndGumroad").then((m) => ({
      component: m.default,
      description: m.PayoneerAndGumroadDescription,
    })),
  "247-what-your-customers-see": () =>
    import("./WhatYourCustomersSee").then((m) => ({
      component: m.default,
      description: m.WhatYourCustomersSeeDescription,
    })),
  "248-delete-a-product": () =>
    import("./DeleteAProduct").then((m) => ({
      component: m.default,
      description: m.DeleteAProductDescription,
    })),
  "249-affiliate-faq": () =>
    import("./AffiliateFaq").then((m) => ({
      component: m.default,
      description: m.AffiliateFaqDescription,
    })),
  "251-incorrect-recurring-charge": () =>
    import("./IncorrectRecurringCharge").then((m) => ({
      component: m.default,
      description: m.IncorrectRecurringChargeDescription,
    })),
  "252-multiple-accounts": () =>
    import("./MultipleAccounts").then((m) => ({
      component: m.default,
      description: m.MultipleAccountsDescription,
    })),
  "260-your-payout-settings-page": () =>
    import("./YourPayoutSettingsPage").then((m) => ({
      component: m.default,
      description: m.YourPayoutSettingsPageDescription,
    })),
  "266-why-are-my-customers-purchases-failing": () =>
    import("./WhyAreMyCustomersPurchasesFailing").then((m) => ({
      component: m.default,
      description: m.WhyAreMyCustomersPurchasesFailingDescription,
    })),
  "268-customer-dashboard": () =>
    import("./CustomerDashboard").then((m) => ({
      component: m.default,
      description: m.CustomerDashboardDescription,
    })),
  "269-balance-page": () =>
    import("./BalancePage").then((m) => ({
      component: m.default,
      description: m.BalancePageDescription,
    })),
  "270-url-parameters": () =>
    import("./UrlParameters").then((m) => ({
      component: m.default,
      description: m.UrlParametersDescription,
    })),
  "275-paypal-connect": () =>
    import("./PaypalConnect").then((m) => ({
      component: m.default,
      description: m.PaypalConnectDescription,
    })),
  "278-guide-to-memberships": () =>
    import("./GuideToMemberships").then((m) => ({
      component: m.default,
      description: m.GuideToMembershipsDescription,
    })),
  "280-create-application-api": () =>
    import("./CreateApplicationApi").then((m) => ({
      component: m.default,
      description: m.CreateApplicationApiDescription,
    })),
  "281-payout-delays": () =>
    import("./PayoutDelays").then((m) => ({
      component: m.default,
      description: m.PayoutDelaysDescription,
    })),
  "282-how-do-purchases-work-for-my-customers": () =>
    import("./HowDoPurchasesWorkForMyCustomers").then((m) => ({
      component: m.default,
      description: m.HowDoPurchasesWorkForMyCustomersDescription,
    })),
  "283-fraudulent-purchases": () =>
    import("./FraudulentPurchases").then((m) => ({
      component: m.default,
      description: m.FraudulentPurchasesDescription,
    })),
  "285-turning-off-third-party-trackers": () =>
    import("./TurningOffThirdPartyTrackers").then((m) => ({
      component: m.default,
      description: m.TurningOffThirdPartyTrackersDescription,
    })),
  "286-how-do-i-report-a-gumroad-creator": () =>
    import("./HowDoIReportAGumroadCreator").then((m) => ({
      component: m.default,
      description: m.HowDoIReportAGumroadCreatorDescription,
    })),
  "288-dmca-counter-notices": () =>
    import("./DmcaCounterNotices").then((m) => ({
      component: m.default,
      description: m.DmcaCounterNoticesDescription,
    })),
  "289-file-size-limits-on-gumroad": () =>
    import("./FileSizeLimitsOnGumroad").then((m) => ({
      component: m.default,
      description: m.FileSizeLimitsOnGumroadDescription,
    })),
  "290-facebook-domain-verification": () =>
    import("./FacebookDomainVerification").then((m) => ({
      component: m.default,
      description: m.FacebookDomainVerificationDescription,
    })),
  "292-account-login-security": () =>
    import("./AccountLoginSecurity").then((m) => ({
      component: m.default,
      description: m.AccountLoginSecurityDescription,
    })),
  "295-external-integration": () =>
    import("./ExternalIntegration").then((m) => ({
      component: m.default,
      description: m.ExternalIntegrationDescription,
    })),
  "304-products-dashboard": () =>
    import("./ProductsDashboard").then((m) => ({
      component: m.default,
      description: m.ProductsDashboardDescription,
    })),
  "324-accessibiility-statement": () =>
    import("./AccessibiilityStatement").then((m) => ({
      component: m.default,
      description: m.AccessibiilityStatementDescription,
    })),
  "325-indirect-taxes-on-sales-via-discover": () =>
    import("./IndirectTaxesOnSalesViaDiscover").then((m) => ({
      component: m.default,
      description: m.IndirectTaxesOnSalesViaDiscoverDescription,
    })),
  "326-teams-and-roles": () =>
    import("./TeamsAndRoles").then((m) => ({
      component: m.default,
      description: m.TeamsAndRolesDescription,
    })),
  "327-purchasing-power-parity": () =>
    import("./PurchasingPowerParity").then((m) => ({
      component: m.default,
      description: m.PurchasingPowerParityDescription,
    })),
  "329-customer-moderation": () =>
    import("./CustomerModeration").then((m) => ({
      component: m.default,
      description: m.CustomerModerationDescription,
    })),
  "330-stripe-connect": () =>
    import("./StripeConnect").then((m) => ({
      component: m.default,
      description: m.StripeConnectDescription,
    })),
  "331-creating-upsells": () =>
    import("./CreatingUpsells").then((m) => ({
      component: m.default,
      description: m.CreatingUpsellsDescription,
    })),
  "333-affiliates-on-gumroad": () =>
    import("./AffiliatesOnGumroad").then((m) => ({
      component: m.default,
      description: m.AffiliatesOnGumroadDescription,
    })),
  "334-more-like-this": () =>
    import("./MoreLikeThis").then((m) => ({
      component: m.default,
      description: m.MoreLikeThisDescription,
    })),
  "335-custom-refund-policy": () =>
    import("./CustomRefundPolicy").then((m) => ({
      component: m.default,
      description: m.CustomRefundPolicyDescription,
    })),
  "336-singaporean-gst": () =>
    import("./SingaporeanGst").then((m) => ({
      component: m.default,
      description: m.SingaporeanGstDescription,
    })),
  "339-product-bundles": () =>
    import("./ProductBundles").then((m) => ({
      component: m.default,
      description: m.ProductBundlesDescription,
    })),
  "341-collaborations": () =>
    import("./Collaborations").then((m) => ({
      component: m.default,
      description: m.CollaborationsDescription,
    })),
  "343-wishlists": () =>
    import("./Wishlists").then((m) => ({
      component: m.default,
      description: m.WishlistsDescription,
    })),
  "344-rate-and-review-your-purchase": () =>
    import("./RateAndReviewYourPurchase").then((m) => ({
      component: m.default,
      description: m.RateAndReviewYourPurchaseDescription,
    })),
  "345-tipping": () =>
    import("./Tipping").then((m) => ({
      component: m.default,
      description: m.TippingDescription,
    })),
  "346-installment-plans": () =>
    import("./InstallmentPlans").then((m) => ({
      component: m.default,
      description: m.InstallmentPlansDescription,
    })),
  "347-gumroad-community": () =>
    import("./GumroadCommunity").then((m) => ({
      component: m.default,
      description: m.GumroadCommunityDescription,
    })),
  "37-how-to-delete-your-gumroad-account": () =>
    import("./HowToDeleteYourGumroadAccount").then((m) => ({
      component: m.default,
      description: m.HowToDeleteYourGumroadAccountDescription,
    })),
  "42-content-security": () =>
    import("./ContentSecurity").then((m) => ({
      component: m.default,
      description: m.ContentSecurityDescription,
    })),
  "43-streaming-videos": () =>
    import("./StreamingVideos").then((m) => ({
      component: m.default,
      description: m.StreamingVideosDescription,
    })),
  "44-build-gumroad-into-your-website": () =>
    import("./BuildGumroadIntoYourWebsite").then((m) => ({
      component: m.default,
      description: m.BuildGumroadIntoYourWebsiteDescription,
    })),
  "46-what-currency-does-gumroad-use": () =>
    import("./WhatCurrencyDoesGumroadUse").then((m) => ({
      component: m.default,
      description: m.WhatCurrencyDoesGumroadUseDescription,
    })),
  "47-how-to-refund-a-customer": () =>
    import("./HowToRefundACustomer").then((m) => ({
      component: m.default,
      description: m.HowToRefundACustomerDescription,
    })),
  "51-what-is-gumroads-refund-policy": () =>
    import("./WhatIsGumroadsRefundPolicy").then((m) => ({
      component: m.default,
      description: m.WhatIsGumroadsRefundPolicyDescription,
    })),
  "53-what-browsers-does-gumroad-support": () =>
    import("./WhatBrowsersDoesGumroadSupport").then((m) => ({
      component: m.default,
      description: m.WhatBrowsersDoesGumroadSupportDescription,
    })),
  "54-not-receiving-updates": () =>
    import("./NotReceivingUpdates").then((m) => ({
      component: m.default,
      description: m.NotReceivingUpdatesDescription,
    })),
  "60-adding-a-cover-image": () =>
    import("./AddingACoverImage").then((m) => ({
      component: m.default,
      description: m.AddingACoverImageDescription,
    })),
  "62-testing-a-purchase": () =>
    import("./TestingAPurchase").then((m) => ({
      component: m.default,
      description: m.TestingAPurchaseDescription,
    })),
  "64-is-gumroad-for-me": () =>
    import("./IsGumroadForMe").then((m) => ({
      component: m.default,
      description: m.IsGumroadForMeDescription,
    })),
  "66-gumroads-fees": () =>
    import("./GumroadsFees").then((m) => ({
      component: m.default,
      description: m.GumroadsFeesDescription,
    })),
  "67-the-settings-menu": () =>
    import("./TheSettingsMenu").then((m) => ({
      component: m.default,
      description: m.TheSettingsMenuDescription,
    })),
  "70-can-i-sell-services": () =>
    import("./CanISellServices").then((m) => ({
      component: m.default,
      description: m.CanISellServicesDescription,
    })),
  "74-the-analytics-dashboard": () =>
    import("./TheAnalyticsDashboard").then((m) => ({
      component: m.default,
      description: m.TheAnalyticsDashboardDescription,
    })),
  "76-license-keys": () =>
    import("./LicenseKeys").then((m) => ({
      component: m.default,
      description: m.LicenseKeysDescription,
    })),
  "78-my-customer-did-not-receive-a-receipt": () =>
    import("./MyCustomerDidNotReceiveAReceipt").then((m) => ({
      component: m.default,
      description: m.MyCustomerDidNotReceiveAReceiptDescription,
    })),
  "79-gumroad-discover": () =>
    import("./GumroadDiscover").then((m) => ({
      component: m.default,
      description: m.GumroadDiscoverDescription,
    })),
  "81-custom-product-urls": () =>
    import("./CustomProductUrls").then((m) => ({
      component: m.default,
      description: m.CustomProductUrlsDescription,
    })),
  "82-membership-products": () =>
    import("./MembershipProducts").then((m) => ({
      component: m.default,
      description: m.MembershipProductsDescription,
    })),
};

export async function getArticle(slug: string): Promise<ArticleModule | undefined> {
  const loader = articles[slug];
  if (!loader) return undefined;
  return loader();
}
