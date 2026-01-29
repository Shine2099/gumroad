import * as React from "react";

import { CardWishlist, CardGrid, Card } from "$app/components/Wishlist/Card";

export const RecommendedWishlists = ({
  title,
  wishlists,
}: {
  title: string;
  wishlists: CardWishlist[];
}) =>
  wishlists.length > 0 ? (
    <section className="flex flex-col gap-4">
      <header>
        <h2>{title}</h2>
      </header>
      <CardGrid>
        {wishlists.map((wishlist) => (
          <Card key={wishlist.id} wishlist={wishlist} eager={false} />
        ))}
      </CardGrid>
    </section>
  ) : null;
