import { Link } from "@inertiajs/react";
import React from "react";

import DateTimeWithRelativeTooltip from "$app/components/Admin/DateTimeWithRelativeTooltip";
import type { User, UserMembership } from "$app/components/Admin/Users/User";
import { Stack, StackItem } from "$app/components/ui/Stack";

type MembershipsProps = {
  user: User;
};

type MembershipProps = {
  membership: UserMembership;
  className?: string;
};

const Membership = ({ membership, className }: MembershipProps) => (
  <div className={className}>
    <div className={`flex items-center gap-4 ${className ? "grow" : ""}`}>
      <img src={membership.seller.avatar_url} className="user-avatar" alt={membership.seller.display_name_or_email} />
      <div className="grid">
        <h5>
          <Link href={Routes.admin_user_url(membership.seller.id)}>{membership.seller.display_name_or_email}</Link>
        </h5>
        <div>{membership.role}</div>
      </div>
    </div>
    <div className="text-right">
      {membership.last_accessed_at ? (
        <div className="space-x-1">
          <span>last accessed</span>
          <DateTimeWithRelativeTooltip date={membership.last_accessed_at} />
        </div>
      ) : null}
    </div>
    <div className="space-x-1">
      <span>invited</span>
      <DateTimeWithRelativeTooltip date={membership.created_at} />
    </div>
  </div>
);

const Memberships = ({ user: { admin_manageable_user_memberships } }: MembershipsProps) =>
  admin_manageable_user_memberships.length > 0 && (
    <>
      <hr />
      <details>
        <summary>
          <h3>User memberships</h3>
        </summary>
        <Stack>
          {admin_manageable_user_memberships.map((membership) => (
            <StackItem key={membership.id} asChild>
              <Membership membership={membership} />
            </StackItem>
          ))}
        </Stack>
      </details>
    </>
  );

export default Memberships;
