import { getSessionRef } from '../firebase';
import { Normalized } from '../../model/Session';
import { pipe } from 'fp-ts/lib/pipeable';
import { normalizeDocument, normalizeQuery } from '../helpers';
import { Card } from '../../model/Card';
import * as A from 'fp-ts/lib/Array';
import * as R from 'fp-ts/lib/Record';
import * as O from 'fp-ts/lib/Option';
import { SessionPlayer } from '../../model/Player';

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

export async function requestPlayerHandListener(
  currentPlayerId: string,
  sessionId: string,
  callback: (h: string[]) => void,
) {
  try {
    await getSessionRef(sessionId)
      .collection('players')
      .onSnapshot(querySnapshot => {
        const players = normalizeQuery<SessionPlayer>(querySnapshot);
        const hand = pipe(
          R.lookup(currentPlayerId, players),
          O.fold(
            () => [],
            player => player.hand,
          ),
        );
        callback(hand);
      });
  } catch (error) {
    console.error(error);
  }
}
