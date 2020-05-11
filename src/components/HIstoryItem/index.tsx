import React from 'react';

import { CardWrapper, PlayerInfo, PlayerName, PlayerStatus } from './styles';
import { AVATAR_BACKGROUND } from '../../theme';
import { SessionPlayer } from '../../model/Player';
import { PlayerImage } from '../LobbyPlayerCard/styles';
import { Play } from '../../model/Session';
import { tellThisPlayStory } from './helpers';

type Props = {
  player: SessionPlayer;
  play: Play;
};

export function HistoryItem(props: Props) {
  return (
    <CardWrapper>
      <PlayerImage src={AVATAR_BACKGROUND} avatar={props.player.avatar} />
      <PlayerInfo>
        <PlayerName>{props.player.name}</PlayerName>
        <PlayerStatus>{tellThisPlayStory(props.play)}</PlayerStatus>
      </PlayerInfo>
    </CardWrapper>
  );
}
