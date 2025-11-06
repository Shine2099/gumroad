import { usePage } from "@inertiajs/react";
import React from "react";

import { default as AdvancedPageComponent, type AdvancedPageProps } from "$app/components/Settings/AdvancedPage";

const AdvancedPage = () => {
  const props = usePage<AdvancedPageProps>().props;

  return <AdvancedPageComponent {...props} />;
};

export default AdvancedPage;
