import axios from 'axios';
import * as A from 'fp-ts/lib/Array';
import { UnionExclude } from './types';
import { ID } from './Session';
import { SessionPlayerWithId } from './Player';
import { firebaseConfig } from '../api/config';

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
  value: UnionExclude<Value, 'PLUS_FOUR' | 'SWAP_ALL'>;
  createdAt?: number;
  status: CardStatus;
};
export type CommonCardWithId = CommonCard & ID;

const colors: Color[] = ['GREEN', 'GOLD', 'RED', 'BLUE', 'BLACK'];
const commonColors: Color[] = ['GREEN', 'GOLD', 'RED', 'BLUE'];

const numberValues: Value[] = [
  'ONE',
  'TWO',
  'THREE',
  'FOUR',
  'FIVE',
  'SIX',
  'SEVEN',
  'EIGHT',
  'NINE',
];

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

export function isCommonCard(card: Card): boolean {
  return commonColors.includes(card.color) && commonValues.includes(card.value);
}

export function isCommonNumberCard(card: Card): card is CommonCard {
  return commonColors.includes(card.color) && numberValues.includes(card.value);
}

export function isBlockCard(card: Card) {
  return card.value === 'BLOCK';
}

export type ActionCard = {
  color: 'BLACK';
  value: 'PLUS_FOUR' | 'SWAP_ALL' | 'COLOR';
  createdAt?: number;
  status: CardStatus;
};

export type Card = CommonCard | ActionCard;
export type CardWithId = Card & ID;

export function buildCommon(color: Color): CommonCard[] {
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

export async function buyCard(sessionId: string, playerId: string, amount = 1) {
  try {
    const response = await axios.request<SessionPlayerWithId>({
      method: 'POST',
      baseURL: firebaseConfig.baseApi,
      url: '/cards/buy',
      data: {
        sessionId,
        playerId,
        amount,
      },
    });
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
