import React from 'react';
import { number, select, withKnobs } from '@storybook/addon-knobs';
import * as O from 'fp-ts/lib/Option';
import { buildDeck } from 'solo-lib/lib/card';

import { ActionArea } from './index';

const COLORS: Record<string, CardColor> = {
  Blue: 'BLUE',
  Green: 'GREEN',
  Gold: 'GOLD',
  Red: 'RED',
};

export function ActionAreaStory() {
  const numberKnob = number('Number', 1, { max: 9, min: 1 });
  const colorKnob = select('Color', COLORS, 'BLUE');
  const card = buildDeck([colorKnob])[numberKnob - 1];

  return <ActionArea currentCard={O.some(card)} onDeckClick={() => {}} />;
}

export default {
  title: 'MinimalSolo/Components/Game',
  component: ActionAreaStory,
  decorators: [withKnobs],
};
