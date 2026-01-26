import * as React from "react";

import { PageHeader } from "$app/components/ui/PageHeader";

export default function FollowersCancelPage() {
  return (
    <div>
      <PageHeader title="You have been unsubscribed." />
      <main className="p-4 md:p-8">
        <p>You will no longer get posts from this creator.</p>
      </main>
    </div>
  );
}
