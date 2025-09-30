import React from "react";
import Loading from '$app/components/Admin/Loading';

type AdminProductStatsViewCountProps = {
  isLoading: boolean;
  viewsCount: number;
}

const AdminProductStatsViewCount = ({
  isLoading,
  viewsCount
}: AdminProductStatsViewCountProps) => {
  if (isLoading) {
    return <Loading />;
  }

  return (
    <li>{viewsCount} views</li>
  );
}

export default AdminProductStatsViewCount;
