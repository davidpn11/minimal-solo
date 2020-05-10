import React from 'react';

import { CardWrapper, PlayerAvatar, PlayerInfo, PlayerName, PlayerStatus } from './styles';
import { SessionPlayer } from '../../model/Player';

type Props = {
  player: SessionPlayer;
};

export function PlayerCard(props: Props) {
  return (
    <CardWrapper>
      <PlayerAvatar src="" alt="" />
      <PlayerInfo>
        <PlayerName>{props.player.name}</PlayerName>
        <PlayerStatus>Map over Statuses</PlayerStatus>
      </PlayerInfo>
    </CardWrapper>
  );
}
