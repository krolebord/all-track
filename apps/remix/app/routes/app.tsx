import { json, LoaderFunction } from "@remix-run/cloudflare";
import { Outlet } from "@remix-run/react";
import { requireUser } from "~/auth/auth-utils.server";
import { useMatchedData as useMatchesData } from "~/utils/loader-utils";

export const loader: LoaderFunction = async ({ request }) => {
  const user = requireUser(request);
  return json({ user });
};

export const useUser = () => {
  const userData = useMatchesData('app');
};

export default function AppRoute() {
  return <Outlet />
}
