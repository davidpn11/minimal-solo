import { text, withKnobs } from '@storybook/addon-knobs';
import React from 'react';
import { PlayerCard } from './index';
import { createAvatar, SessionPlayer } from '../../model/Player';

export function PlayerCardStory() {
  const nameKnob = text('Player Name', 'Michel Costa');
  const player: SessionPlayer = {
    name: nameKnob,
    status: 'READY',
    avatar: createAvatar(),
    hand: [],
  };

  return <PlayerCard player={player} />;
}

export default {
  title: 'MinimalSolo/Components/Game',
  component: PlayerCardStory,
  decorators: [withKnobs],
};
