import { Head } from "@inertiajs/react";
import * as React from "react";

import { Button } from "$app/components/Button";
import { Layout, type LayoutProps } from "$app/components/server-components/DownloadPage/Layout";
import { Placeholder, PlaceholderImage } from "$app/components/ui/Placeholder";

import placeholderImage from "$assets/images/placeholders/comic-stars.png";

export type UnavailablePageProps = Omit<LayoutProps, "content_unavailability_reason_code" | "children">;

export const UnavailablePageLayout = ({
  titleSuffix,
  contentUnavailabilityReasonCode,
  children,
  ...layoutProps
}: UnavailablePageProps & {
  titleSuffix: string;
  contentUnavailabilityReasonCode: LayoutProps["content_unavailability_reason_code"];
  children: React.ReactNode;
}) => {
  const productName = layoutProps.purchase?.product_name ?? layoutProps.installment?.name ?? "";
  const title = productName ? `${productName} - ${titleSuffix}` : titleSuffix;

  return (
    <>
      <Head title={title} />
      <Layout {...layoutProps} content_unavailability_reason_code={contentUnavailabilityReasonCode}>
        {children}
      </Layout>
    </>
  );
};

const fullHeightPlaceholderClassName = "flex-1 content-center";

export const AccessExpiredContent = () => (
  <Placeholder className={fullHeightPlaceholderClassName}>
    <PlaceholderImage src={placeholderImage} />
    <h2>Access expired</h2>
    <p>It looks like your access to this product has expired. Please contact the creator for further assistance.</p>
  </Placeholder>
);

export const RentalExpiredContent = () => (
  <Placeholder className={fullHeightPlaceholderClassName}>
    <PlaceholderImage src={placeholderImage} />
    <h2>Your rental has expired</h2>
    <p>Rentals expire 30 days after purchase or 72 hours after you've begun watching it.</p>
  </Placeholder>
);

export const MembershipInactiveContent = ({
  product_name,
  product_long_url,
  membership,
}: {
  product_name: string;
  product_long_url: string | null;
  membership: {
    is_alive_or_restartable: boolean | null;
    subscription_id: string;
  } | null;
}) => (
  <Placeholder className={fullHeightPlaceholderClassName}>
    <PlaceholderImage src={placeholderImage} />
    <h2>Your membership is inactive</h2>
    <p>You cannot access the content of {product_name} because your membership is no longer active.</p>
    {membership ? (
      membership.is_alive_or_restartable ? (
        <Button asChild color="primary">
          <a href={Routes.manage_subscription_url(membership.subscription_id)}>Manage membership</a>
        </Button>
      ) : product_long_url ? (
        <Button asChild color="primary">
          <a href={product_long_url}>Resubscribe</a>
        </Button>
      ) : null
    ) : null}
  </Placeholder>
);

export const InstallmentPlanInactiveContent = ({
  product_name,
  installment_plan,
}: {
  product_name: string;
  installment_plan: {
    subscription_id: string;
    is_alive_or_restartable: boolean | null;
  };
}) => (
  <Placeholder className={fullHeightPlaceholderClassName}>
    <PlaceholderImage src={placeholderImage} />
    <h2>Your installment plan is inactive</h2>
    {installment_plan.is_alive_or_restartable ? (
      <>
        <p>Please update your payment method to continue accessing the content of {product_name}.</p>
        <Button asChild color="primary">
          <a href={Routes.manage_subscription_url(installment_plan.subscription_id)}>Update payment method</a>
        </Button>
      </>
    ) : (
      <p>You cannot access the content of {product_name} because your installment plan is no longer active.</p>
    )}
  </Placeholder>
);
