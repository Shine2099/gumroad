import { usePage } from "@inertiajs/react";
import React from "react";

import { default as PaymentsPageComponent, type PaymentsPageProps } from "$app/components/Settings/PaymentsPage";

const PaymentsPage = () => {
  const props = usePage<PaymentsPageProps>().props;

  return <PaymentsPageComponent {...props} />;
};

export default PaymentsPage;
