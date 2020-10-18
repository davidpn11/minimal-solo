import { pipe } from 'fp-ts/lib/pipeable';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { extractDocumentData, normalizeDocument } from 'solo-lib/lib/utils/firebase';

import { getSessionRef } from '../firebase';

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
      .doc(currentPlayerId)
      .onSnapshot(documentSnapshot => {
        const player = extractDocumentData<SessionPlayer>(documentSnapshot);

        pipe(
          player,
          O.fold(
            () => {
              throw new Error('No Player');
            },
            p => {
              callback(p.hand);
            },
          ),
        );
      });
  } catch (error) {
    console.error(error);
  }
}

export async function requestAddPlay(sessionId: string, play: Play) {
  return await getSessionRef(sessionId).collection('progression').add(play);
}
