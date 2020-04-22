import React from "react";
import { ButtonVariant, ButtonWrapper } from "./style";

type Props = {
  children: React.ReactNode;
  variant: ButtonVariant;
  onClick?: () => void;
};

export function Button(props: Props) {
  return <ButtonWrapper {...props}>{props.children}</ButtonWrapper>;
}

Button.defaultProps = {
  variant: "primary",
};
