import { Head, usePage } from "@inertiajs/react";
import * as React from "react";
import { cast } from "ts-safe-cast";

import { StandaloneLayout } from "$app/inertia/layout";

import { Layout, LayoutProps } from "$app/components/server-components/DownloadPage/Layout";
import { Placeholder, PlaceholderImage } from "$app/components/ui/Placeholder";

import placeholderImage from "$assets/images/placeholders/comic-stars.png";

export type UnavailablePageProps = LayoutProps & {
  product_name: string;
};

export const useUnavailablePageProps = () => cast<UnavailablePageProps>(usePage().props);

const fullHeightPlaceholderClassName = "flex-1 content-center";

export const UnavailablePageLayout = ({
  titleSuffix,
  pageProps,
  children,
}: {
  titleSuffix: string;
  pageProps: UnavailablePageProps;
  children: React.ReactNode;
}) => {
  const productName = pageProps.product_name ?? "";
  const title = productName ? `${productName} - ${titleSuffix}` : titleSuffix;

  return (
    <>
      <Head title={title} />
      <Layout {...pageProps}>
        <Placeholder className={fullHeightPlaceholderClassName}>
          <PlaceholderImage src={placeholderImage} />
          {children}
        </Placeholder>
      </Layout>
    </>
  );
};

export const withStandaloneLayout = (page: React.ReactNode) => <StandaloneLayout>{page}</StandaloneLayout>;
