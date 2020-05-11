import { select, text, withKnobs } from '@storybook/addon-knobs';
import React from 'react';
import styled from 'styled-components';
import * as O from 'fp-ts/lib/Option';

import { HistoryItem } from './';
import { createAvatar, SessionPlayer } from '../../model/Player';
import { Play } from '../../model/Session';

const avatar = createAvatar();

const Wrapper = styled.div`
  width: 360px;
`;

const PLAY_TYPES: Record<string, Play['type']> = {
  DrawCard: 'DRAW_CARD',
  PlayCard: 'PLAY_CARD',
};

export function HistoryItemStory() {
  const nameKnob = text('Player Name', 'Michel Costa');
  const playType = select('Play Type', PLAY_TYPES, 'DRAW_CARD');

  const player: SessionPlayer = {
    name: nameKnob,
    status: 'READY',
    avatar,
    hand: [],
  };

  const play: Play = {
    player: player,
    target: O.none,
    type: playType,
    card: O.some({ color: 'RED', value: 'ONE', status: 'PLAY' }),
  };

  return (
    <Wrapper>
      <HistoryItem player={player} play={play} />
    </Wrapper>
  );
}

export default {
  title: 'MinimalSolo/Components/Game',
  component: HistoryItemStory,
  decorators: [withKnobs],
};
