import styled, { css } from 'styled-components';
import { rgba } from 'polished';

import { WithMinimalSoloTheme } from '../../theme';

export type LobbyPlayerStatus = 'ADMIN' | 'READY' | 'NOT_READY';
type WrapperProps = { status: LobbyPlayerStatus };

function mapStatusStyles(props: WithMinimalSoloTheme & WrapperProps) {
  switch (props.status) {
    case 'ADMIN':
      return css`
        background: ${props.theme.backgrounds.admin};
        border-color: ${props.theme.colors.blueLight};
      `;
    case 'READY':
      return css`
        background: ${props.theme.backgrounds.ready};
        border-color: ${props.theme.colors.greenLight};
      `;
    case 'NOT_READY':
    default:
      return css`
        background: ${props.theme.backgrounds.notReady};
        border-color: ${props.theme.colors.redLight};
      `;
  }
}

export const Wrapper = styled.div<WrapperProps>`
  align-items: center;
  border-radius: ${props => props.theme.radius.small}px;
  border: 1px solid;
  box-shadow: ${props => props.theme.shadows.base};
  color: ${props => props.theme.colors.white};
  display: flex;
  flex-flow: row nowrap;
  height: 48px;
  padding: ${props => props.theme.spacing.base}px;
  transition: 150ms ease-in-out;
  width: 100%;
  max-width: 300px;
  ${mapStatusStyles}
`;

export const PlayerImage = styled.div<{ src: string; avatar: PlayerAvatar }>`
  background: ${props => props.theme.colors.blackBase};
  border: 2px solid ${props => rgba(props.theme.colors.blackest, 0.5)};
  border-radius: ${props => props.theme.radius.small}px;
  min-height: 32px;
  min-width: 32px;
  background: url('${props => props.src}');
  background-repeat: no-repeat;
  background-size: ${props => props.avatar.scale}%;
  background-position-x: ${props => props.avatar.positionX}px;
  background-position-y: ${props => props.avatar.positionY}px;
`;

export const PlayerInfo = styled.div`
  align-items: flex-start;
  cursor: default;
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  justify-content: center;
  margin-left: ${props => props.theme.spacing.base}px;
  width: 100%;
`;

export const PlayerName = styled.h2`
  font-size: 12px;
  font-weight: 600;
`;

export const PlayerStatus = styled.p`
  font-size: 10px;
`;
