import React from 'react';
import { number, select, withKnobs } from '@storybook/addon-knobs';
import { pipe } from 'fp-ts/lib/pipeable';
import * as A from 'fp-ts/lib/Array';
import { random } from 'faker';

import { PlayerHand } from './';
import { buildOne, Card, sortDeck } from '../../model/Card';
import { Normalized } from '../../model/Session';
import { STATES as SOLO_STATES } from '../Solo/Solo.story';
import { STATES as PASS_STATES } from '../Pass/Pass.story';

const deck = sortDeck(buildOne());
export function PlayerHandStory() {
  const cardAmount = number('Card Amount', 7);
  const soloStatesKnob = select('Solo State', SOLO_STATES, 'CANNOT_SOLO');
  const passStatesKnob = select('Pass State', PASS_STATES, 'CANNOT_PASS');

  return (
    <PlayerHand
      solo={soloStatesKnob}
      pass={passStatesKnob}
      cards={pipe(
        deck,
        A.takeLeft(cardAmount),
        A.reduce<Card, Normalized<Card>>({}, (acc, card) => ({
          ...acc,
          [random.uuid()]: card,
        })),
      )}
    />
  );
}

export default {
  title: 'MinimalSolo/Components/Game',
  component: PlayerHandStory,
  decorators: [withKnobs],
};
