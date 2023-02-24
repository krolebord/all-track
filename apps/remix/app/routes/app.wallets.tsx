import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/cloudflare";
import { namedAction } from "remix-utils";

export const loader = (async ({ request }) => {
  return json({});
}) satisfies LoaderFunction;

export default function Route() {
  return (<>
    <h1>Wallets</h1>
    <WalletForm action='?/createWallet' />
  </>);
}
