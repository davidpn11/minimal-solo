import styled, { css } from 'styled-components';

export type PassButtonProps = { isActive: boolean; isPassable: boolean };
export const PassButton = styled.button<PassButtonProps>`
  background-color: ${props => props.theme.colors.blackest};
  border-radius: ${props => props.theme.radius.base}px;
  border: 1px solid ${props => props.theme.colors.blackShadow};
  box-shadow: ${props => props.theme.shadows.lighter};
  box-sizing: border-box;
  height: 156px;
  outline: none;
  position: relative;
  transition: all 300ms ease-in-out;
  min-width: 104px;

  ${props =>
    props.isActive &&
    css`
      background: ${props.theme.colors.greenBase};
      border-color: ${props.theme.colors.greenShadow};
    `}

  ${props =>
    props.isPassable &&
    css`
      cursor: pointer;
      border-color: ${props.theme.colors.blueBase};

      :hover {
        background: ${props.theme.colors.blueBase};
        border-color: ${props.theme.colors.blueShadow};
      }
    `}
`;
