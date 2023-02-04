import { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";
import { authenticator } from "~/auth/auth.server";
import { ExternalLogin } from "~/components/ExternalLogin";

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/app",
  });
};

export const action: ActionFunction = async ({ request }) => {
  return await authenticator.authenticate("password", request, {
    successRedirect: "/app",
    failureRedirect: "/login",
  });
};

export default function Login() {
  return (<>
    <ExternalLogin />
  </>);
}
