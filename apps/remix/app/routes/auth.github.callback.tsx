import { LoaderArgs } from "@remix-run/cloudflare";
import { authenticator } from "~/auth/auth.server";

export async function loader({ request }: LoaderArgs) {
  return authenticator.authenticate("github", request, {
    successRedirect: "/app",
    failureRedirect: "/login",
  });
};