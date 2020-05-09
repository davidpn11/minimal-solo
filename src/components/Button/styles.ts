import styled from "styled-components";

export type ButtonVariant = "primary" | "secondary";
type ButtonWrapperProps = { variant: ButtonVariant; disabled?: boolean };

export const ButtonWrapper = styled.button<ButtonWrapperProps>`
  align-items: center;
  background: ${(props) =>
    props.disabled
      ? props.theme.backgrounds.whiteSmoke
      : props.variant === "primary"
      ? props.theme.backgrounds.primaryButton
      : props.theme.backgrounds.secondaryButton};
  border-radius: ${({ theme }) => theme.radius.small}px;
  border: none;
  cursor: pointer;
  display: flex;
  text-transform: uppercase;
  padding: ${({ theme }) =>
    `${theme.spacing.base}px ${theme.spacing.highest}px`};
  outline: none;

  span {
    color: ${(props) => props.theme.colors.white};
    font-size: 14px;
    font-weight: bold;
    line-height: 16px;
    text-align: center;
    width: 100%;
  }
`;
