import * as React from "react";

import { Layout } from "$app/components/EmailAction/Layout";

function Show() {
  return (
    <Layout heading="Review reminders enabled">
      You will start receiving review reminders for all purchases again.
    </Layout>
  );
}

Show.disableLayout = true;
export default Show;
