import { Head } from "@inertiajs/react";
import * as React from "react";

import { Layout, type LayoutProps } from "$app/components/server-components/DownloadPage/Layout";

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
