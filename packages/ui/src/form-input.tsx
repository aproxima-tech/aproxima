import { Label, type LabelProps } from './label';
import { Input, type InputProps } from './input';
import { InlineError } from './inline-error';
import { getInputProps, type FieldMetadata } from '@conform-to/react';

export type FormInputProps = Omit<InputProps, 'id' | 'type'> & {
  labelProps?: LabelProps;
  label: string;
  type: 'text' | 'email' | 'password';
  fieldData: FieldMetadata<string, Record<string, unknown>, string[]>;
};

export function FormInput({ label, labelProps, type, fieldData, ...inputProps }: FormInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={fieldData.id} {...labelProps}>
        {label}
      </Label>
      <Input {...getInputProps(fieldData, { type })} {...inputProps} />
      <InlineError id={fieldData.errorId}>{fieldData.errors}</InlineError>
    </div>
  );
}
