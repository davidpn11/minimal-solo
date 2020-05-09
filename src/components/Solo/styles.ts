import styled, { css } from 'styled-components';
import { WithMinimalSoloTheme } from '../../theme';

export type SoloButtonStates = 'CAN_SOLO' | 'CANNOT_SOLO' | 'IS_SOLO' | 'DIDNT_SOLO';
type SoloButtonProps = { state: SoloButtonStates };

function mapStates(props: WithMinimalSoloTheme & SoloButtonProps) {
  switch (props.state) {
    case 'CAN_SOLO':
      return css`
        background: ${props.theme.colors.blackest};
        border-color: ${props.theme.colors.blueShadow};
        cursor: pointer;

        &:hover {
          background: ${props.theme.colors.blueBase};
          border-color: ${props.theme.colors.blueShadow};
        }
      `;
    case 'CANNOT_SOLO':
      return css`
        background: ${props.theme.colors.blackest};
        border-color: ${props.theme.colors.blackShadow};
      `;
    case 'DIDNT_SOLO':
      return css`
        background: ${props.theme.colors.redBase};
        border-color: ${props.theme.colors.redShadow};
      `;
    case 'IS_SOLO':
      return css`
        background: ${props.theme.colors.greenBase};
        border-color: ${props.theme.colors.greenShadow};
      `;
    default:
      throw new Error('Invalid Solo Button State');
  }
}

export const SoloButton = styled.button<SoloButtonProps>`
  border-radius: ${props => props.theme.radius.base}px;
  border: 1px solid;
  box-shadow: ${props => props.theme.shadows.lighter};
  box-sizing: border-box;
  height: 156px;
  outline: none;
  position: relative;
  transition: all 300ms ease;
  width: 104px;

  ${mapStates}

  :disabled {
    cursor: default;
  }
`;
