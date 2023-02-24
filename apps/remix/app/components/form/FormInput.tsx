import clsx from "clsx";
import { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";
import { useField } from "remix-validated-form";
import { FormField, FormFieldProps } from './FormField';

type FormInputProps = FormFieldProps & InputHTMLAttributes<HTMLInputElement> & {
  isRequired?: boolean;
  type?: HTMLInputTypeAttribute
};

export const FormInput = (props: FormInputProps) => {
  const {
    id,
    label,
    description,
    isRequired,
    ...rest
  } = props;

  const { getInputProps, error } = useField(id);
  const inputProps = getInputProps();

  return (
    <FormField id={id} label={label} description={description} error={error} >
      <input
        className={clsx(
          'px-1 bg-transparent border-b-2 border-gray-700 outline-none bg-gradient-to-t from-gray-800 focus:from-gray-700/70 focus:border-gray-500',
          error && 'border-red-500'
        )}
        {...inputProps}
        {...rest}
        required={isRequired ?? false}
      />
    </FormField>
  );
};
