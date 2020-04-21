import styled, { css } from "styled-components";
import { WithMinimalSoloTheme } from "../../theme";

export type LobbyPlayerStatus = "ADMIN" | "READY" | "NOT_READY";
type WrapperProps = { status: LobbyPlayerStatus };

function mapStatusStyles(props: WithMinimalSoloTheme & WrapperProps) {
  switch (props.status) {
    case "ADMIN":
      return css`
        background: ${props.theme.backgrounds.admin};
        border-color: ${props.theme.colors.blueLight};
      `;
    case "READY":
      return css`
        background: ${props.theme.backgrounds.ready};
        border-color: ${props.theme.colors.greenLight};
      `;
    case "NOT_READY":
    default:
      return css`
        background: ${props.theme.backgrounds.notReady};
        border-color: ${props.theme.colors.redLight};
      `;
  }
}

export const Wrapper = styled.div<WrapperProps>`
  align-items: center;
  border-radius: ${(props) => props.theme.radius.small}px;
  border: 1px solid;
  box-shadow: ${(props) => props.theme.shadows.base};
  color: ${(props) => props.theme.colors.white};
  display: flex;
  flex-flow: row nowrap;
  height: 48px;
  padding: ${(props) => props.theme.spacing.base}px;
  transition: 150ms ease-in-out;
  width: 25%;
  ${mapStatusStyles}
`;

export const PlayerImage = styled.img`
  background: ${(props) => props.theme.colors.blackBase};
  border: none;
  border-radius: ${(props) => props.theme.radius.small}px;
  height: 32px;
  width: 32px;
`;

export const PlayerInfo = styled.div`
  align-items: flex-start;
  cursor: default;
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  justify-content: center;
  margin-left: ${(props) => props.theme.spacing.base}px;
  width: 100%;
`;

export const PlayerName = styled.h2`
  font-size: 12px;
  font-weight: 600;
`;

export const PlayerStatus = styled.p`
  font-size: 10px;
`;
