import { usePage } from "@inertiajs/react";
import * as React from "react";
import { cast } from "ts-safe-cast";

import { Layout as ProductLayout, Props as ProductLayoutProps } from "$app/components/Product/Layout";
import { Layout as ProfileLayout } from "$app/components/Profile/Layout";

type ProfileProductShowPageProps = {
  product: ProductLayoutProps;
};

const ProfileProductShowPage = () => {
  const { product } = cast<ProfileProductShowPageProps>(usePage().props);

  return (
    <ProfileLayout creatorProfile={product.creator_profile}>
      <ProductLayout cart {...product} />
    </ProfileLayout>
  );
};

ProfileProductShowPage.loggedInUserLayout = true;

export default ProfileProductShowPage;
