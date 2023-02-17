import { useField } from "remix-validated-form";
import { FormField, FormFieldProps } from './FormField';
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { forwardRef } from "react";
import { clsx } from 'clsx';
import { HTMLAttributes } from "react";


type SelectItemProps = {
  value: string;
} & HTMLAttributes<HTMLElement>;
const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Item className={clsx('', className)} {...props} ref={forwardedRef}>
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator>
        <CheckIcon />
        <select/>
      </Select.ItemIndicator>
    </Select.Item>
  );
});

type SelectProps = {
  items: { label: string, value: string }[];
  defaultValue?: string;
  required?: boolean;
};
const SelectBase = (props: SelectProps) => {
  const { defaultValue, required, ...rest } = props;
  return (
    <Select.Root defaultValue={defaultValue} required={required} {...rest} >
      <Select.Trigger>
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content>
          <Select.ScrollUpButton>
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport>
            {props.items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton>
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

type FormSelectProps = FormFieldProps & {
  items: { label: string, value: string }[];
  isRequired?: boolean;
};

export const FormSelect = (props: FormSelectProps) => {
  const {
    id,
    label,
    description,
    isRequired,
    items
  } = props;

  const { getInputProps, error } = useField(id);
  const inputProps = getInputProps();

  return (
    <FormField id={id} label={label} description={description} error={error} >
      <SelectBase items={items} required={isRequired} {...inputProps} />
    </FormField>
  );
};
