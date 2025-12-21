import { usePage } from "@inertiajs/react";
import React from "react";
import { cast } from "ts-safe-cast";

import { WidgetsPage } from "$app/components/server-components/Developer/WidgetsPage";
import { useExternalScripts } from "$app/hooks/useExternalScripts";

type Product = {
  name: string;
  script_base_url: string;
  url: string;
  gumroad_domain_url: string;
};

type Props = {
  default_product: Product;
  display_product_select: boolean;
  products: Product[];
  affiliated_products: Product[];
};

const PublicWidgets = () => {
  const { default_product, display_product_select, products, affiliated_products } = cast<Props>(usePage().props);

  useExternalScripts(["/js/gumroad.js", "/js/gumroad-embed.js"]);

  return (
    <WidgetsPage
      default_product={default_product}
      display_product_select={display_product_select}
      products={products}
      affiliated_products={affiliated_products}
    />
  );
};

export default PublicWidgets;
