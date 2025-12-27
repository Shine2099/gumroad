import React from "react";

import { Button } from "$app/components/Button";
import { LoadingSpinner } from "$app/components/LoadingSpinner";
import { Alert } from "$app/components/ui/Alert";
import { Stack, StackItem } from "$app/components/ui/Stack";

import AdminProductPurchase, { ProductPurchase } from "./Purchase";

type AdminProductPurchasesContentProps = {
  purchases: ProductPurchase[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
};

const AdminProductPurchasesContent = ({
  purchases,
  isLoading,
  hasMore,
  onLoadMore,
}: AdminProductPurchasesContentProps) => {
  if (purchases.length === 0 && !isLoading)
    return (
      <Alert role="status" variant="info">
        No purchases have been made.
      </Alert>
    );

  return (
    <div className="flex flex-col gap-4">
      <Stack>
        {purchases.map((purchase) => (
          <StackItem key={purchase.external_id} asChild>
            <AdminProductPurchase purchase={purchase} />
          </StackItem>
        ))}
      </Stack>

      {isLoading ? <LoadingSpinner /> : null}

      {hasMore ? (
        <Button small onClick={onLoadMore} disabled={isLoading}>
          {isLoading ? "Loading..." : "Load more"}
        </Button>
      ) : null}
    </div>
  );
};

export default AdminProductPurchasesContent;
