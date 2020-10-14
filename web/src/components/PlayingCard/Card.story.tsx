import { select, withKnobs } from '@storybook/addon-knobs';
import React from 'react';
import { PlayingCard } from './index';
import { Color, CardStatus, Value } from '../../model/Card';

const COLORS: Record<string, Color> = {
  Blue: 'BLUE',
  Green: 'GREEN',
  Gold: 'GOLD',
  Red: 'RED',
  Black: 'BLACK',
};

const ACTION_VALUES: Record<string, Value> = {
  PlusFour: 'PLUS_FOUR',
  SwapAll: 'SWAP_ALL',
  Color: 'COLOR',
};

const COMMON_VALUES: Record<string, Value> = {
  One: 'ONE',
  Two: 'TWO',
  Three: 'THREE',
  Four: 'FOUR',
  Five: 'FIVE',
  Six: 'SIX',
  Seven: 'SEVEN',
  Eight: 'EIGHT',
  Nine: 'NINE',
  Block: 'BLOCK',
  Reverse: 'REVERSE',
  PlusTwo: 'PLUS_TWO',
  Swap: 'SWAP',
};

const STATUSES: Record<string, CardStatus> = {
  Deck: 'DECK',
  Hand: 'HAND',
  Play: 'PLAY',
  Game: 'GAME',
};

export function CardStory() {
  const statusKnob = select('Status', STATUSES, 'HAND');
  const colorKnob = select('Color', COLORS, 'BLUE');
  const isActionCard = colorKnob === 'BLACK';
  const [cardTypes, defaultCard]: [Record<string, Value>, Value] = isActionCard
    ? [ACTION_VALUES, 'PLUS_FOUR']
    : [COMMON_VALUES, 'ONE'];
  const valueKnob = select('Card', cardTypes, defaultCard);

  return <PlayingCard status={statusKnob} value={valueKnob} color={colorKnob} />;
}

export default {
  title: 'MinimalSolo/Components/Game',
  component: CardStory,
  decorators: [withKnobs],
};
