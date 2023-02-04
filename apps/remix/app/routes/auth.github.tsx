import { redirect, ActionArgs } from "@remix-run/cloudflare";
import { authenticator } from "~/auth/auth.server";

export async function loader() {
  return redirect("/login");
}

export async function action({ request }: ActionArgs) {
  return authenticator.authenticate("github", request);
};
