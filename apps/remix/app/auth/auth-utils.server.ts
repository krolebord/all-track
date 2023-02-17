import { redirect } from "@remix-run/cloudflare";
import { authenticator } from "./auth.server";

export const requireUser = async (request: Request, context: LoadContext) => {
  const user = await authenticator(context).isAuthenticated(request);
  if (!user) {
    throw redirect("/login");
  }
  return user;
};
