import { usePage } from "@inertiajs/react";
import React from "react";

import { default as PasswordPageComponent, type PasswordPageProps } from "$app/components/Settings/PasswordPage";

const PasswordPage = () => {
  const props = usePage<PasswordPageProps>().props;

  return <PasswordPageComponent {...props} />;
};

export default PasswordPage;
