import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Debug } from "~/components/Debug";
import { trpc } from "~/trpc";

export const loader = async () => {
  const entries = await trpc.hello.entries.query();

  return json({ entries });
};

export default function EntriesRoute() {
  const { entries } = useLoaderData<typeof loader>();

  return (<>
    <h1>Entries</h1>
    <Debug value={entries} />
  </>)
};
