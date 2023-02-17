import * as Label from '@radix-ui/react-label';
import { ReactNode } from 'react';

export type FormFieldProps = {
  id: string;
  label?: string;
  description?: string;
  error?: string;
};

export const FormField = (props: FormFieldProps & { children: ReactNode }) => {
  const {
    id,
    label,
    description,
    error
  } = props;


  return (
    <div>
      <Label.Root htmlFor={id} >
        {label ?? id}
      </Label.Root>
      
      {props.children}

      {!error && description && <p>{description}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};
