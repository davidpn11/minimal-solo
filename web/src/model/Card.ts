import axios from 'axios';
import * as A from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/pipeable';
import { random } from 'faker';
import { SessionPlayerWithId } from './Player';
import { firebaseConfig } from '../api/config';

export function createAvatar() {
  return {
    positionX: random.number({ min: -1400, max: -10 }),
    positionY: random.number({ min: -1000, max: -10 }),
    scale: random.number({ min: 5000, max: 5500 }),
  };
}

const colors: CardColor[] = ['GREEN', 'GOLD', 'RED', 'BLUE', 'BLACK'];
const commonValues: CommonCardValue[] = [
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

const actionValues: ActionCardValue[] = ['BLOCK', 'REVERSE', 'PLUS_TWO', 'SWAP'];

function buildCommonCards(color: CommonActionCardColor): CommonCard[] {
  return commonValues.map(value => ({
    color,
    value,
    createdAt: Date.now(),
    status: 'DECK',
    type: 'COMMON',
  }));
}

function buildActionCards(color: CommonActionCardColor): ActionCard[] {
  return actionValues.map(value => ({
    color,
    value,
    createdAt: Date.now(),
    status: 'DECK',
    type: 'ACTION',
  }));
}

function buildSpecialCards(): SpecialCard[] {
  return [
    {
      color: 'BLACK',
      value: 'SWAP_ALL',
      createdAt: Date.now(),
      status: 'DECK',
      type: 'SPECIAL',
    },
    {
      color: 'BLACK',
      value: 'PLUS_FOUR',
      createdAt: Date.now(),
      status: 'DECK',
      type: 'SPECIAL',
    },
  ];
}

export function buildDeck(deckColors = colors) {
  return pipe(
    [...deckColors],
    A.map(color => {
      if (color === 'BLACK') {
        return pipe(A.range(1, 4), A.map(buildSpecialCards), A.flatten);
      }
      return A.flatten<Card>([buildCommonCards(color), buildActionCards(color)]);
    }),
    A.flatten,
  );
}

export function sortDeck(deck: Card[]): Card[] {
  return deck.sort(() => Math.random() - 0.5);
}

export const isCommonCard = (card: Card): card is CommonCard => card.type === 'COMMON';
export const isBlockCard = (card: Card): card is ActionCard => card.value === 'BLOCK';

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
