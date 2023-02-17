import { useField } from "remix-validated-form";
import { FormField, FormFieldProps } from './FormField';

type FormInputProps = FormFieldProps & {
  isRequired?: boolean;
};

export const FormInput = (props: FormInputProps) => {
  const {
    id,
    label,
    description,
    isRequired
  } = props;

  const { getInputProps, error } = useField(id);
  const inputProps = getInputProps();

  return (
    <FormField id={id} label={label} description={description} error={error} >
      <input {...inputProps} required={isRequired ?? false} />
    </FormField>
  );
};
