import * as A from 'fp-ts/lib/Array';
import { UnionExclude } from './types';

export type Color = 'GREEN' | 'GOLD' | 'RED' | 'BLUE' | 'BLACK';
export type Value =
  | 'ONE'
  | 'TWO'
  | 'THREE'
  | 'FOUR'
  | 'FIVE'
  | 'SIX'
  | 'SEVEN'
  | 'EIGHT'
  | 'NINE'
  | 'BLOCK'
  | 'REVERSE'
  | 'PLUS_TWO'
  | 'PLUS_FOUR'
  | 'SWAP'
  | 'SWAP_ALL'
  | 'COLOR';

export type CardStatus = 'HAND' | 'DECK' | 'GAME' | 'PLAY';

export type CommonCard = {
  color: UnionExclude<Color, 'BLACK'>;
  value: UnionExclude<Value, 'PLUS_FOR' | 'SWAP_ALL'>;
  createdAt?: number;
  status: CardStatus;
};

export type ActionCard = {
  color: 'BLACK';
  value: 'PLUS_FOUR' | 'SWAP_ALL' | 'COLOR';
  createdAt: number;
  status: CardStatus;
};

const colors: Color[] = ['GREEN', 'GOLD', 'RED', 'BLUE', 'BLACK'];
const commonValues: Value[] = [
  'ONE',
  'TWO',
  'THREE',
  'FOUR',
  'FIVE',
  'SIX',
  'SEVEN',
  'EIGHT',
  'NINE',
  'BLOCK',
  'REVERSE',
  'PLUS_TWO',
  'SWAP',
];

export type Card = CommonCard | ActionCard;

function buildCommon(color: Color): CommonCard[] {
  return commonValues.map(
    value =>
      ({
        color,
        value,
        createdAt: 0,
        status: 'DECK',
      } as CommonCard),
  );
}

const buildSpecial = (): ActionCard[] => {
  return [
    {
      color: 'BLACK',
      value: 'SWAP_ALL',
      createdAt: 0,
      status: 'DECK',
    },
    {
      color: 'BLACK',
      value: 'PLUS_FOUR',
      createdAt: 0,
      status: 'DECK',
    },
  ];
};

export function buildOne(): Card[] {
  const cs = colors.map(c => {
    if (c === 'BLACK') {
      return [...buildSpecial(), ...buildSpecial(), ...buildSpecial(), ...buildSpecial()];
    } else {
      return buildCommon(c);
    }
  });

  return A.flatten<CommonCard | ActionCard>(cs);
}

export function sortDeck(deck: Card[]): Card[] {
  return deck.sort(() => Math.random() - 0.5);
}
