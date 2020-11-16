import { number, text, withKnobs, boolean } from '@storybook/addon-knobs';
import React from 'react';
import styled from 'styled-components';
import * as A from 'fp-ts/lib/Array';
import { random } from 'faker';
import { createAvatar } from '@mikelfcosta/solo-lib/lib/player';

import { PlayerCard } from './index';

const avatar = createAvatar();

const Wrapper = styled.div`
  width: 360px;
`;

export function PlayerCardStory() {
  const nameKnob = text('Player Name', 'Michel Costa');
  const cardCount = number('Card count', 7);
  const isCurrentPlayer = boolean('Is current player', false);

  const player: SessionPlayer = {
    name: nameKnob,
    position: 0,
    status: 'READY',
    avatar,
    hand: A.range(1, cardCount).map(() => random.uuid()),
  };

  return (
    <Wrapper>
      <PlayerCard player={player} isCurrentPlayer={isCurrentPlayer} />
    </Wrapper>
  );
}

export default {
  title: 'MinimalSolo/Components/Game',
  component: PlayerCardStory,
  decorators: [withKnobs],
};
