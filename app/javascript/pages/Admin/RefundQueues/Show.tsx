import { usePage } from "@inertiajs/react";
import React from "react";

import { type Pagination } from "$app/hooks/useLazyFetch";

import EmptyState from "$app/components/Admin/EmptyState";
import PaginatedLoader from "$app/components/Admin/PaginatedLoader";
import RefundableUser, { type User } from "$app/components/Admin/Users/User";

type Props = {
  users: User[];
  pagination: Pagination;
};

const AdminRefundQueue = () => {
  const { users, pagination } = usePage<Props>().props;

  return (
    <section className="flex flex-col gap-4">
      {users.map((user) => (
        <RefundableUser key={user.id} user={user} is_affiliate_user={false} />
      ))}
      {pagination.page === 1 && users.length === 0 && <EmptyState message="No users found." />}
      <PaginatedLoader itemsLength={users.length} pagination={pagination} only={["users", "pagination"]} />
    </section>
  );
};

export default AdminRefundQueue;
