import React from 'react';
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@material-ui/core/TextField';
import { FieldProps, getIn } from 'formik';

export type TextFieldProps = FieldProps & Omit<MuiTextFieldProps, 'name' | 'value' | 'error' | 'variant'>;

export function fieldToTextField({
  disabled,
  field,
  form: { isSubmitting, touched, errors },
  ...props
}: TextFieldProps): MuiTextFieldProps {
  const fieldError = getIn(errors, field.name);
  const showError = getIn(touched, field.name) && !!fieldError;

  return {
    ...props,
    ...field,
    error: showError,
    helperText: showError ? fieldError : props.helperText,
    disabled: disabled ?? isSubmitting,
    variant: 'outlined',
  };
}

export function TextField({ children, ...props }: TextFieldProps) {
  return <MuiTextField {...fieldToTextField(props)}>{children}</MuiTextField>;
}

TextField.displayName = 'FormikMaterialUITextField';
