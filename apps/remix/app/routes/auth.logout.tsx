import { ActionFunction } from "@remix-run/cloudflare";
import { authenticator } from "~/auth/auth.server";

export const action: ActionFunction = async ({ request }) => {
  return authenticator.logout(request, { redirectTo: '/' });
}
