import React from 'react';
import {
  PlayerImage,
  PlayerInfo,
  PlayerStatus,
  PlayerName,
  Wrapper,
  LobbyPlayerStatus,
} from './styles';

type Props = {
  name: string;
  avatar: string;
  status: LobbyPlayerStatus;
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
    <Wrapper status={props.status}>
      <PlayerImage src={props.avatar} />
      <PlayerInfo>
        <PlayerName>{props.name}</PlayerName>
        <PlayerStatus>{mapStatus(props.status)}</PlayerStatus>
      </PlayerInfo>
    </Wrapper>
  );
}
