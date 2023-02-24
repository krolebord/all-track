import { json, SerializeFrom } from "@remix-run/cloudflare";
import { Link, Outlet, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { requireUser } from "~/auth/auth-utils.server";
import { AvatarIcon } from '@radix-ui/react-icons';
import { GlobalProgressIndicator } from "~/components/GlobalProgressIndicator";

export const loader = async ({ request, context }: LoaderArgs) => {
  const user = await requireUser(request, context);
  return json({ user });
};

export const useUser = () => {
  const userData = useRouteLoaderData('app') as SerializeFrom<typeof loader>;
  return userData.user;
};

export default function AppRoute() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-row min-h-screen overflow-x-hidden">
      <aside className="flex flex-col min-h-full border-r-2 border-gray-700">
        <Link to="/app" className="flex items-center h-12 px-2 text-xl font-semibold text-gray-500 border-b border-gray-700 whitespace-nowrap">
          <h2>All-Track</h2>
        </Link>
        <nav className="flex flex-col justify-between flex-1 p-2 min-w-[10rem]">
          <ul>
            <li>
              <Link to="/app/wallets">Wallets</Link>
            </li>
          </ul>
          <Link to="/app/profile" className="flex flex-row items-center justify-center gap-2 py-2 text-gray-500 hover:text-gray-400">
            <AvatarIcon></AvatarIcon>
            {user.email}
          </Link>
        </nav>
      </aside>
      <main className="relative flex-1 p-2 overflow-x-auto">
        <GlobalProgressIndicator />
        <Outlet />
      </main>
    </div>
  )
}
