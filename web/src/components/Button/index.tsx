import React from 'react';
import { ButtonVariant, ButtonWrapper } from './styles';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant: ButtonVariant;
};

export function Button(props: Props) {
  return (
    <ButtonWrapper {...props}>
      <span>{props.children}</span>
    </ButtonWrapper>
  );
}

Button.defaultProps = {
  variant: 'primary',
};
