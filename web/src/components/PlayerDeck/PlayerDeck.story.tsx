import React from 'react';
import { number, text, withKnobs } from '@storybook/addon-knobs';
import * as A from 'fp-ts/lib/Array';
import { random } from 'faker';
import { createAvatar } from '@mikelfcosta/solo-lib/lib/player';

import { PlayerDeck } from './index';

export function PlayerDeckStory() {
  const playerName = text('Player Name', 'Jack Johnson');
  const cardCount = number('Card Count', 8);
  const player: SessionPlayer = {
    name: playerName,
    position: 0,
    status: 'READY',
    avatar: createAvatar(),
    hand: A.range(1, cardCount).map(() => random.uuid()),
  };

  return <PlayerDeck playerPosition={0} player={player} />;
}

export default {
  title: 'MinimalSolo/Components/Game',
  component: PlayerDeckStory,
  decorators: [withKnobs],
};
