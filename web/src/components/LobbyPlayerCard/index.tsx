import React from 'react';
import {
  PlayerImage,
  PlayerInfo,
  PlayerStatus,
  PlayerName,
  Wrapper,
  LobbyPlayerStatus,
} from './styles';
import { SessionPlayer } from '../../model/Player';
import { AVATAR_BACKGROUND } from '../../theme';

type Props = {
  player: SessionPlayer;
};

function mapStatus(status: LobbyPlayerStatus) {
  switch (status) {
    case 'ADMIN':
      return 'Admin';
    case 'READY':
      return 'Ready';
    case 'NOT_READY':
    default:
      return 'Not Ready';
  }
}

export function LobbyPlayerCard(props: Props) {
  return (
    <Wrapper status={props.player.status}>
      <PlayerImage src={AVATAR_BACKGROUND} avatar={props.player.avatar} />
      <PlayerInfo>
        <PlayerName>{props.player.name}</PlayerName>
        <PlayerStatus>{mapStatus(props.player.status)}</PlayerStatus>
      </PlayerInfo>
    </Wrapper>
  );
}
