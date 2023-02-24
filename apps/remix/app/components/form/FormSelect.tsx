import { useField } from "remix-validated-form";
import { FormField, FormFieldProps } from './FormField';
import * as SelectPrimitive from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { forwardRef } from "react";
import { clsx } from 'clsx';
import { HTMLAttributes } from "react";


type SelectItemProps = {
  value: string;
} & HTMLAttributes<HTMLElement>;
const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(({ children, className, ...props }, forwardedRef) => {
  return (
    <SelectPrimitive.Item 
      className={clsx(
        className,
        "relative flex items-center px-2 py-1 text-sm text-gray-300 focus:bg-gradient-to-r from-gray-700 via-transparent",
        "radix-disabled:opacity-50",
        "focus:outline-none select-none"
      )}
      {...props}
      ref={forwardedRef}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute inline-flex items-center right-1">
        <CheckIcon />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
});

type SelectProps = {
  items: { label: string, value: string }[];
  defaultValue?: string;
  error?: string;
};
const Select = (props: SelectProps) => {
  const { defaultValue, error, ...rest } = props;
  return (
    <SelectPrimitive.Root defaultValue={defaultValue} {...rest} >
      <SelectPrimitive.Trigger 
        className={clsx(
          'inline-flex flex-row items-center justify-between h-[26px]',
          "px-1 bg-transparent border-b-2 border-gray-700 outline-none bg-gradient-to-t from-gray-800 focus:from-gray-700/70 focus:border-gray-500",
          error && 'border-red-500'
        )}
      >
        <SelectPrimitive.Value />
        <SelectPrimitive.Icon className="ml-2">
          <ChevronDownIcon />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content>
          <SelectPrimitive.Viewport className="bg-gray-900 border border-gray-800 shadow-lg">
            {props.items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}

type FormSelectProps = FormFieldProps & {
  items: { label: string, value: string }[];
};

export const FormSelect = (props: FormSelectProps) => {
  const {
    id,
    label,
    description,
    items
  } = props;

  const { getInputProps, error } = useField(id);
  const inputProps = getInputProps();

  return (
    <FormField id={id} label={label} description={description} error={error} >
      <Select items={items} error={error} {...inputProps} />
    </FormField>
  );
};
