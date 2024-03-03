import type { FormProps as RemixFormProps } from '@remix-run/react';
import { Form as RemixForm } from '@remix-run/react';
import { clsx } from 'clsx';
import { forwardRef } from 'react';

type FormProps = RemixFormProps;

export const Form = forwardRef<HTMLFormElement, FormProps>(({ className, children, ...props }, ref) => {
  return (
    <RemixForm
      ref={ref}
      className={clsx('w-full m-auto lg:max-w-3xl flex flex-col items-center justify-center gap-5', className)}
      {...props}
    >
      {children}
    </RemixForm>
  );
});

Form.displayName = 'Form';

export const Fieldset = forwardRef<HTMLFieldSetElement, React.HTMLProps<HTMLFieldSetElement>>(
  ({ className, ...props }, ref) => {
    return (
      <fieldset
        ref={ref}
        className={clsx('w-full m-auto lg:max-w-3xl flex flex-col items-center justify-center gap-5', className)}
        {...props}
      />
    );
  },
);
