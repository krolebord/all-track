import { redirect } from "@remix-run/cloudflare";
import { authenticator } from "./auth.server";

export const requireUser = async (request: Request) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    throw redirect("/login");
  }
  return user;
};
