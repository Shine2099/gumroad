import { useForm, usePage } from "@inertiajs/react";
import * as React from "react";

import { resendTwoFactorToken } from "$app/data/login";
import { assertResponseError } from "$app/utils/request";

import { Layout } from "$app/components/Authentication/Layout";
import { Button } from "$app/components/Button";
import { showAlert, type AlertPayload } from "$app/components/server-components/Alert";
import { useOriginalLocation } from "$app/components/useOriginalLocation";

type PageProps = {
  user_id: string;
  email: string;
  token: string | null;
  flash: AlertPayload;
};

function TwoFactorAuthentication() {
  const { user_id, email, token: initialToken, flash } = usePage<PageProps>().props;
  const next = new URL(useOriginalLocation()).searchParams.get("next");
  const uid = React.useId();

  const [resending, setResending] = React.useState(false);

  const form = useForm({
    token: initialToken ?? "",
    next,
    user_id,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Post to /two-factor with user_id in body for Rack::Attack throttling
    form.post("/two-factor");
  };

  const resendToken = async () => {
    setResending(true);
    try {
      await resendTwoFactorToken(user_id);
      showAlert("Resent the authentication token, please check your inbox.", "success");
    } catch (e) {
      assertResponseError(e);
      showAlert(e.message, "error");
    }
    setResending(false);
  };

  const errorMessage = flash?.message ?? null;

  return (
    <Layout
      header={
        <>
          <h1>Two-Factor Authentication</h1>
          <h3>
            To protect your account, we have sent an Authentication Token to {email}. Please enter it here to continue.
          </h3>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <section>
          {errorMessage ? (
            <div role="alert" className="danger">
              {errorMessage}
            </div>
          ) : null}
          <fieldset>
            <legend>
              <label htmlFor={uid}>Authentication Token</label>
            </legend>
            <input
              id={uid}
              type="text"
              value={form.data.token}
              onChange={(e) => form.setData("token", e.target.value)}
              required
              autoFocus
            />
          </fieldset>
          <Button color="primary" type="submit" disabled={form.processing}>
            {form.processing ? "Logging in..." : "Login"}
          </Button>
          <Button disabled={resending} onClick={() => void resendToken()}>
            Resend Authentication Token
          </Button>
        </section>
      </form>
    </Layout>
  );
}

TwoFactorAuthentication.disableLayout = true;
export default TwoFactorAuthentication;
