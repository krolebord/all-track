import { redirect } from "@remix-run/cloudflare";
import { authenticator } from "~/auth/auth.server";

export async function loader() {
  return redirect("/login");
}

export async function action({ request, context }: ActionArgs) {
  return authenticator(context).authenticate("google", request);
};
