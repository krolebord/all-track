import { authenticator } from "~/auth/auth.server";

export const action = async ({ request, context }: LoaderArgs) => {
  return authenticator(context).logout(request, { redirectTo: '/' });
}
