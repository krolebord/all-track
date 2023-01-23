import { Button } from "@all-track/ui"
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { trpc } from "~/trpc";

export const loader = async () => {
  const trpcData = await trpc.hello.world.query('ok');

  return json(trpcData);
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      {loaderData.message}
      <br/>
      {loaderData.date}
      <br />
      <Button />
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
