import * as Label from '@radix-ui/react-label';
import clsx from 'clsx';
import { ReactNode } from 'react';

export type FormFieldProps = {
  id: string;
  label?: string;
  description?: string;
  error?: string;
  className?: string;
};

export const FormField = (props: FormFieldProps & { children: ReactNode }) => {
  const {
    id,
    label,
    description,
    error,
    className,
  } = props;

  return (
    <div className={clsx('flex flex-col', className)}>
      <Label.Root htmlFor={id} >
        {label ?? id}
      </Label.Root>
      
      {props.children}

      {!error && description && <p>{description}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};
