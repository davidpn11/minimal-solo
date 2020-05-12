import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

import { LocalSessionWithId, Session } from '../../../model/Session';
import { getStorage } from '../../../utils/storage';
import { getSessionRef } from '../../../api/firebase';
import { extractDocumentData } from '../../../api/helpers';
import { requestFullSession } from '../../../api/db/session';

type LoadSession = { session: LocalSessionWithId; playerId: string };

export async function loadSession(): Promise<O.Option<LoadSession>> {
  try {
    return await pipe(
      getStorage(),
      O.chain(storage => O.fromNullable(storage.getItem('sessionId'))),
      O.fold(
        () => Promise.resolve(O.none),
        async sessionId => {
          const sessionDoc = await requestFullSession(sessionId);

          return Promise.resolve(
            pipe(
              loadPlayer(),
              O.chain(playerId => O.some({ session: { ...sessionDoc, id: sessionId }, playerId })),
            ),
          );
        },
      ),
    );
  } catch (error) {
    return Promise.resolve(O.none);
  }
}

export function loadPlayer(): O.Option<string> {
  return pipe(
    getStorage(),
    O.chain(storage => O.fromNullable(storage.getItem('playerId'))),
  );
}
