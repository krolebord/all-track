import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/cloudflare";
import { namedAction } from "remix-utils";
import { userTrpc } from "~/trpc.server";
import { requireUser } from "~/auth/auth-utils.server";
import { WalletForm, newWalletValidator } from "~/components/wallets/WalletForm";
import { validationError } from "remix-validated-form";

export const loader = async ({ request, context }: LoaderArgs) => {
  const user = await requireUser(request, context);
  const trpc = userTrpc(context, user.apiToken);

  const wallets = await trpc.wallets.getWallets.query();

  return json({ wallets });
};

const createWallet = async ({ request, context }: ActionArgs) => {
  const user = await requireUser(request, context);
  const trpc = userTrpc(context, user.apiToken);

  const { data: newWallet, error } = await newWalletValidator.validate(await request.formData());

  if (error) {
    return validationError(error);
  }

  trpc.wallets.createWallet.mutate(newWallet);

  return redirect('/app/wallets');
}

export async function action(args: ActionArgs) {
  return namedAction(args.request, {
    createWallet: () => createWallet(args)
  });
}

export default function Route() {
  const { wallets } = useLoaderData<typeof loader>();

  return (<>
    <h1>Wallets</h1>
    {wallets.map(wallet => (
      <div key={wallet.id}>
        <Link to={`/wallets/${wallet.id}`}>{wallet.name}</Link>
      </div>
    ))}
    <WalletForm action='?/createWallet' />
  </>);
}
