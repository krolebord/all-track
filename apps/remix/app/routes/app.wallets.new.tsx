import { currencies } from '@all-track/currencies';
import { json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { Debug } from '~/components/Debug';
import { WalletForm } from '~/components/wallets/WalletForm';

export const action = ({}: ActionArgs) => {
  return json({});
};

export default function Route() {
  return (
    <WalletForm action='' />
  );
}
