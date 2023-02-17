import { json, LoaderFunction, SerializeFrom } from "@remix-run/cloudflare";
import { Outlet, useLoaderData, useNavigate, useRouteLoaderData } from "@remix-run/react";
import { requireUser } from "~/auth/auth-utils.server";

export const loader = async ({ request, context }: LoaderArgs) => {
  const user = await requireUser(request, context);
  return json({ user });
};

export const useUser = () => {
  const userData = useRouteLoaderData('app') as SerializeFrom<typeof loader>;
  return userData.user;
};

export default function AppRoute() {
  return <Outlet />
}
