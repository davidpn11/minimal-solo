import React from 'react';

import { CardWrapper, PlayerInfo, PlayerName, PlayerStatus } from './styles';
import { PlayerImage } from '../LobbyPlayerCard/styles';
import { AVATAR_BACKGROUND } from '../../theme';

type Props = {
  player: SessionPlayer;
  isCurrentPlayer: boolean;
};

export function PlayerCard(props: Props) {
  return (
    <CardWrapper>
      <PlayerImage src={AVATAR_BACKGROUND} avatar={props.player.avatar} />
      <PlayerInfo>
        <PlayerName>{props.player.name}</PlayerName>
        {props.isCurrentPlayer ? (
          <PlayerStatus>Currently playing...</PlayerStatus>
        ) : (
          <PlayerStatus>Holding {props.player.hand.length} card(s).</PlayerStatus>
        )}
      </PlayerInfo>
    </CardWrapper>
  );
}
