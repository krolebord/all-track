import { authenticator } from "~/auth/auth.server";
import { ExternalLogin } from "~/components/ExternalLogin";

export const loader = async ({ request, context }: LoaderArgs) => {
  return await authenticator(context).isAuthenticated(request, {
    successRedirect: "/app",
  });
};

export const action = async ({ request, context }: ActionArgs) => {
  return await authenticator(context).authenticate("password", request, {
    successRedirect: "/app",
    failureRedirect: "/login",
  });
};

export default function Login() {
  return (<>
    <ExternalLogin />
  </>);
}
