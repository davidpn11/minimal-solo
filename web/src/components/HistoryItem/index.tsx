import React from 'react';

import { CardWrapper, PlayerInfo, PlayerName, PlayerStatus } from './styles';
import { AVATAR_BACKGROUND } from '../../theme';
import { PlayerImage } from '../LobbyPlayerCard/styles';
import { tellThisPlayStory } from './helpers';

type Props = {
  play: Play;
};

export function HistoryItem(props: Props) {
  return (
    <CardWrapper>
      <PlayerImage src={AVATAR_BACKGROUND} avatar={props.play.player.avatar} />
      <PlayerInfo>
        <PlayerName>{props.play.player.name}</PlayerName>
        <PlayerStatus>{tellThisPlayStory(props.play)}</PlayerStatus>
      </PlayerInfo>
    </CardWrapper>
  );
}
