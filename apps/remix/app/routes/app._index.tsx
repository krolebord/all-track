import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { requireUser } from "~/auth/auth-utils.server";
import { Debug } from "~/components/Debug";
import { LogoutButton } from "~/components/LogoutButton";
import { userTrpc } from "~/trpc.server";

export const loader = async ({ request, context }: LoaderArgs) => {
  const user = await requireUser(request, context);
  const trpcUser = await userTrpc(context, user.apiToken).auth.info.query();

  return json({
    user,
    trpcUser
  });
};

export default function AppRoute() {
  const { user, trpcUser } = useLoaderData<typeof loader>();

  return (<>
    <Debug value={user}/>
    <Debug value={trpcUser}/>
    <LogoutButton />
  </>);
}
