import React from 'react';
import { number, select, withKnobs } from '@storybook/addon-knobs';
import { pipe } from 'fp-ts/lib/pipeable';
import * as A from 'fp-ts/lib/Array';
import { random } from 'faker';

import { PlayerHand } from './index';
import { buildDeck, sortDeck } from '../../model/Card';
import { Normalized } from '../../model/Session';
import { SoloButtonStates } from '../Solo/styles';
import { PassButtonStates } from '../Pass';

const SOLO_STATES: Record<string, SoloButtonStates> = {
  CanSolo: 'CAN_SOLO',
  CannotSolo: 'CANNOT_SOLO',
  IsSolo: 'IS_SOLO',
  DidntSolo: 'DIDNT_SOLO',
};

const PASS_STATES: Record<string, PassButtonStates> = {
  CanPass: 'CAN_PASS',
  Passed: 'PASSED',
  CannotPass: 'CANNOT_PASS',
};

const deck = sortDeck(buildDeck());
export function PlayerHandStory() {
  const cardAmount = number('Card Amount', 7);
  const soloStatesKnob = select('Solo State', SOLO_STATES, 'CANNOT_SOLO');
  const passStatesKnob = select('Pass State', PASS_STATES, 'CANNOT_PASS');

  return (
    <PlayerHand
      onSolo={() => {}}
      solo={soloStatesKnob}
      onPass={() => {}}
      pass={passStatesKnob}
      onCardClick={() => {}}
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
