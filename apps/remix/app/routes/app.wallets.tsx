import { Link, Outlet } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/cloudflare";

export const loader = (async ({ request }) => {
  return json({});
}) satisfies LoaderFunction;

export default function Route() {
  return (<>
    <Link to={'new'}>new</Link>
    <Outlet />
  </>);
}
