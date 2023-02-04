import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth/auth.server";
import { Debug } from "~/components/Debug";
import { trpc } from "~/trpc.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  console.log("user", user);
  const entries = await trpc().hello.entries.query();

  return json({ entries });
};

export default function EntriesRoute() {
  const { entries } = useLoaderData<typeof loader>();

  return (<>
    <h1>Entries</h1>
    <Debug value={entries} />
  </>)
};
