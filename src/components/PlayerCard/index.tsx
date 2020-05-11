import React from 'react';

import { CardWrapper, PlayerInfo, PlayerName, PlayerStatus } from './styles';
import { SessionPlayer } from '../../model/Player';
import { PlayerImage } from '../LobbyPlayerCard/styles';
import { AVATAR_BACKGROUND } from '../../theme';

type Props = {
  player: SessionPlayer;
};

export function PlayerCard(props: Props) {
  return (
    <CardWrapper>
      <PlayerImage src={AVATAR_BACKGROUND} avatar={props.player.avatar} />
      <PlayerInfo>
        <PlayerName>{props.player.name}</PlayerName>
        <PlayerStatus>Map over Statuses</PlayerStatus>
      </PlayerInfo>
    </CardWrapper>
  );
}
