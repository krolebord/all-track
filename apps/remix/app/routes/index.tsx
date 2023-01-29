import { Button } from "@all-track/ui"
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Debug } from "~/components/Debug";
import { trpc } from "~/trpc";

export const loader = async () => {
  const entries = await trpc.hello.entries.query();

  return json({ entries });
}

export default function Index() {
  const { entries } = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <Button />

      <Debug value={entries} />

      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
