import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

import { LocalSessionWithId, Session } from '../../../model/Session';
import { getStorage } from '../../../utils/storage';
import { getSessionRef } from '../../../api/firebase';
import { extractDocumentData } from '../../../api/helpers';

type LoadSession = { session: LocalSessionWithId; playerId: string };

export async function loadSession(): Promise<O.Option<LoadSession>> {
  try {
    return await pipe(
      getStorage(),
      O.chain(storage => O.fromNullable(storage.getItem('sessionId'))),
      O.fold(
        () => Promise.resolve(O.none),
        async sessionId => {
          const sessionDoc = await getSessionRef(sessionId).get();
          const sessionO = extractDocumentData<Session>(sessionDoc);

          return Promise.resolve(
            pipe(
              sessionO,
              O.chain(session =>
                pipe(
                  loadPlayer(),
                  O.chain(playerId => O.some({ session: { ...session, id: sessionId }, playerId })),
                ),
              ),
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
