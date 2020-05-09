import React from 'react';
import { ButtonVariant, ButtonWrapper } from './styles';

type Props = {
  children: React.ReactNode;
  variant: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
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
