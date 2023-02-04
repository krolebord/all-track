import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { requireUser } from "~/auth/auth-utils.server";
import { authenticator } from "~/auth/auth.server";
import { Debug } from "~/components/Debug";
import { LogoutButton } from "~/components/LogoutButton";
import { trpc } from "~/trpc.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  const trpcUser = await trpc(user.apiToken).auth.info.query();

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
