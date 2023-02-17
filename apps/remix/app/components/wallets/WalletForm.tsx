import { ValidatedForm } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { FormInput } from "../form/FormInput";
import { FormSelect } from "../form/FormSelect";
import { currencies } from "@all-track/currencies";
import { newWalletSchema } from "@all-track/trpc/validation";

const walletValidator = withZod(newWalletSchema);

const currencyOptions = currencies.map(currency => ({
  label: currency.name,
  value: currency.code.toString()
}));

type WalletFormProps = {
  action: string;
  defaultValues?: z.infer<typeof newWalletSchema>;
};
export const WalletForm = (props: WalletFormProps) => {
  const { action, defaultValues } = props;
  
  return (
    <ValidatedForm
      validator={walletValidator}
      defaultValues={defaultValues}
      method="post"
      action={action}
    >
      <FormInput id={"name"} />
      <FormInput id={"description"} />
      <FormInput id={"balance"} />
      <FormSelect id={"currency"} items={currencyOptions} />
      <button type="submit">Submit</button>
    </ValidatedForm>
  );
};
