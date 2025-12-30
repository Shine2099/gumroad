import { cast } from "ts-safe-cast";

import { ResponseError, request } from "$app/utils/request";

export const renewPassword = async (email: string) => {
  const response = await request({
    method: "POST",
    url: Routes.forgot_password_path(),
    accept: "json",
    data: { user: { email } },
  });
  if (!response.ok) {
    const { error_message } = cast<{ error_message: string }>(await response.json());
    throw new ResponseError(error_message);
  }
};
