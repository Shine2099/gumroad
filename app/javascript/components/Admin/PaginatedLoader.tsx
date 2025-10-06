import { WhenVisible } from "@inertiajs/react";
import React from "react";

import { type Pagination } from "$app/hooks/useLazyFetch";

import Loading from "$app/components/Admin/Loading";

type PaginatedLoaderProps = {
  itemsLength: number;
  pagination: Pagination;
  only: string[];
};

const PaginatedLoader = ({ itemsLength, pagination, only }: PaginatedLoaderProps) => {
  const itemsLengthFromCurrentPage = itemsLength / pagination.page;

  if (itemsLengthFromCurrentPage >= pagination.limit) {
    const params = {
      data: { page: pagination.page + 1 },
      only,
      preserveScroll: true,
    };

    return (
      <WhenVisible fallback={<Loading />} params={params}>
        <div />
      </WhenVisible>
    );
  }

  return null;
};

export default PaginatedLoader;
