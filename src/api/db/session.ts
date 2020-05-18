import * as O from 'fp-ts/lib/Option';

import { getSessionRef } from '../firebase';
import { LocalSessionWithId } from '../../model/Session';
import { extractDocumentData, normalizeQuery } from '../helpers';

export async function requestFullSession(sessionId: string): Promise<LocalSessionWithId> {
  const session = await getSessionRef(sessionId).get();
  const sessionData = extractDocumentData<LocalSessionWithId>(session);

  if (O.isNone(sessionData)) {
    throw new Error('Session not found');
  }

  const players = await getSessionRef(sessionId).collection('players').get();

  return {
    ...sessionData.value,
    players: normalizeQuery(players),
  };
}
