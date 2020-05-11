import { select, text, withKnobs } from '@storybook/addon-knobs';
import React from 'react';
import { LobbyPlayerCard } from './index';
import { createAvatar, SessionPlayer } from '../../model/Player';

const avatar = createAvatar();

export function LobbyPlayerCardStory() {
  const nameKnob = text('Player Name', 'Michel Costa');
  const statusKnob = select(
    'Status Type',
    {
      Admin: 'ADMIN',
      Ready: 'READY',
      NotReady: 'NOT_READY',
    },
    'ADMIN',
  );
  const player: SessionPlayer = {
    name: nameKnob,
    status: statusKnob,
    avatar,
    hand: [],
  };

  return <LobbyPlayerCard player={player} />;
}

export default {
  title: 'MinimalSolo/Components/Game',
  component: LobbyPlayerCardStory,
  decorators: [withKnobs],
};
