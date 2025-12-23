import { usePage } from "@inertiajs/react";
import * as React from "react";

import { showAlert, type AlertPayload } from "$app/components/server-components/Alert";
import { Alert } from "$app/components/ui/Alert";

type PageProps = {
  flash?: AlertPayload;
};

export const FlashError: React.FC = () => {
  const { flash } = usePage<PageProps>().props;

  if (flash?.status === "warning" && flash.message) {
    return <Alert variant="danger">{flash.message}</Alert>;
  } else if (flash?.status === "success" && flash?.message) {
    showAlert(flash.message, "success");
    return null;
  }

  return null;
};
