import styled, { css } from 'styled-components';
import { WithMinimalSoloTheme } from '../../theme';
import { lighten } from 'polished';

export type ButtonVariant = 'primary' | 'secondary' | 'cancel';
type ButtonWrapperProps = { variant: ButtonVariant; disabled?: boolean };

function mapVariant(props: WithMinimalSoloTheme & ButtonWrapperProps) {
  if (props.disabled) {
    return css`
      background: ${props.theme.backgrounds.whiteSmoke};
      cursor: default;
      user-select: none;
    `;
  }

  switch (props.variant) {
    case 'cancel':
      return css`
        background: transparent;

        :hover {
          background: ${props.theme.colors.blackLight};
        }

        span {
          color: ${props.theme.colors.border};
        }
      `;
    case 'secondary':
      return css`
        background: ${props.theme.backgrounds.secondaryButton};

        :hover {
          background: ${lighten(0.05, props.theme.backgrounds.secondaryButton)};
        }

        span {
          color: ${props => props.theme.colors.white};
        }
      `;
    case 'primary':
      return css`
        background: ${props.theme.backgrounds.primaryButton};

        :hover {
          background: ${lighten(0.05, props.theme.backgrounds.primaryButton)};
        }

        span {
          color: ${props => props.theme.colors.white};
        }
      `;
    default:
      throw new Error('Invalid variant type supplied to button');
  }
}

export const ButtonWrapper = styled.button<ButtonWrapperProps>`
  align-items: center;
  border-radius: ${({ theme }) => theme.radius.small}px;
  border: none;
  cursor: pointer;
  display: flex;
  text-transform: uppercase;
  padding: ${({ theme }) => `${theme.spacing.base}px ${theme.spacing.highest}px`};
  outline: none;
  transition: all 150ms ease;
  ${mapVariant}

  span {
    font-size: 14px;
    font-weight: bold;
    line-height: 16px;
    text-align: center;
    width: 100%;
  }
`;
