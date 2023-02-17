import { authenticator } from "~/auth/auth.server";

export async function loader({ request, context }: LoaderArgs) {
  return authenticator(context).authenticate("google", request, {
    successRedirect: "/app",
    failureRedirect: "/login",
  });
};
