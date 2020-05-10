import { select, text, withKnobs } from '@storybook/addon-knobs';
import React from 'react';
import { PlayerCard } from './index';
import { SessionPlayer } from '../../model/Player';

export function PlayerCardStory() {
  const nameKnob = text('Player Name', 'Michel Costa');
  const avatarKnob = text('AvatarUrl', 'http://placekitten.com/32/32');
  const player: SessionPlayer = {
    name: nameKnob,
    status: 'READY',
    hand: [],
  };

  return <PlayerCard player={player} />;
}

export default {
  title: 'MinimalSolo/Components/Game',
  component: PlayerCardStory,
  decorators: [withKnobs],
};
