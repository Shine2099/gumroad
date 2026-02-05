import { usePage } from "@inertiajs/react";
import * as React from "react";
import { cast } from "ts-safe-cast";

import { PoweredByFooter } from "$app/components/PoweredByFooter";
import { Layout, Props as ProductLayoutProps } from "$app/components/Product/Layout";

type ProductShowPageProps = {
  product: ProductLayoutProps;
};

const ProductShowPage = () => {
  const { product } = cast<ProductShowPageProps>(usePage().props);

  return (
    <>
      <Layout {...product} />
      <PoweredByFooter />
    </>
  );
};

ProductShowPage.loggedInUserLayout = true;

export default ProductShowPage;
