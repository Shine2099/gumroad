import { Head, usePage } from "@inertiajs/react";
import * as React from "react";
import { cast } from "ts-safe-cast";

import { CreatorProfile } from "$app/parsers/profile";

import { Product, Purchase, WishlistForProduct } from "$app/components/Product";
import { Layout as ProfileLayout } from "$app/components/Profile/Layout";
import { CoffeeProduct } from "$app/components/Product/CoffeeProduct";

type Props = {
  product: Product;
  purchase: Purchase | null;
  wishlists: WishlistForProduct[];
  discount_code: { valid: boolean; code?: string; discount?: unknown } | null;
  creator_profile: CreatorProfile;
  custom_styles: string;
};

export default function CoffeePage() {
  const { product, purchase, creator_profile, custom_styles } = cast<Props>(usePage().props);

  return (
    <>
      <Head>
        <style>{custom_styles}</style>
      </Head>
      <ProfileLayout creatorProfile={creator_profile} hideFollowForm>
        <CoffeeProduct
          product={product}
          purchase={purchase}
          selection={null}
          className="mx-auto w-full max-w-6xl lg:px-0"
        />
      </ProfileLayout>
    </>
  );
}
CoffeePage.loggedInUserLayout = true;
