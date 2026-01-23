import { Link } from "@inertiajs/react";
import * as React from "react";

import { Layout } from "$app/components/EmailAction/Layout";

function Show() {
  return (
    <Layout heading="You will no longer receive review reminder emails.">
      If you wish to resubscribe to all review reminder emails, please click{" "}
      <span>
        <Link href={Routes.user_subscribe_review_reminders_path()} className="underline">
          here
        </Link>
        .
      </span>
    </Layout>
  );
}

Show.disableLayout = true;
export default Show;
