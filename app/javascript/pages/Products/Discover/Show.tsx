import { usePage } from "@inertiajs/react";
import * as React from "react";
import { cast } from "ts-safe-cast";

import { Taxonomy } from "$app/utils/discover";

import { Layout as DiscoverLayout } from "$app/components/Discover/Layout";
import { Layout, Props as ProductLayoutProps } from "$app/components/Product/Layout";

type DiscoverProductShowPageProps = {
  product: ProductLayoutProps & { taxonomy_path: string | null; taxonomies_for_nav: Taxonomy[] };
};

const DiscoverProductShowPage = () => {
  const { product } = cast<DiscoverProductShowPageProps>(usePage().props);

  return (
    <DiscoverLayout
      taxonomyPath={product.taxonomy_path ?? undefined}
      taxonomiesForNav={product.taxonomies_for_nav}
      forceDomain
    >
      <Layout cart hasHero {...product} />
    </DiscoverLayout>
  );
};

DiscoverProductShowPage.loggedInUserLayout = true;

export default DiscoverProductShowPage;
