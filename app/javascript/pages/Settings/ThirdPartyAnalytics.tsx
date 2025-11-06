import { usePage } from "@inertiajs/react";
import React from "react";

import {
  default as ThirdPartyAnalyticsPageComponent,
  type ThirdPartyAnalyticsPageProps,
} from "$app/components/Settings/ThirdPartyAnalyticsPage";

function ThirdPartyAnalyticsPage() {
  const props = usePage<ThirdPartyAnalyticsPageProps>().props;

  return <ThirdPartyAnalyticsPageComponent {...props} />;
}

export default ThirdPartyAnalyticsPage;
