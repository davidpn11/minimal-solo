import { getSessionRef } from '../firebase';
import { Normalized } from '../../model/Session';
import { pipe } from 'fp-ts/lib/pipeable';
import { normalizeDocument } from '../helpers';
import { Card } from '../../model/Card';
import * as A from 'fp-ts/lib/Array';

export async function requestGetPlayerHand(
  sessionId: string,
  hand: string[],
): Promise<Normalized<Card>> {
  const session = getSessionRef(sessionId);
  const getCard = async (cardId: string) => {
    return normalizeDocument<Card>(await session.collection('activeCards').doc(cardId).get());
  };

  const normalizedHand = await Promise.all(hand.map(getCard));
  return pipe(
    normalizedHand,
    A.reduce<Normalized<Card>, Normalized<Card>>({}, (acc, card) => ({ ...acc, ...card })),
  );
}
