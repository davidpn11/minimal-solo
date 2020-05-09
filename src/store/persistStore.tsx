import React, { useEffect, useState } from 'react';
import { batch, useDispatch } from 'react-redux';
import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';

import { getStorage } from '../utils/storage';
import { getSessionRef } from '../api/firebase';
import { LocalSessionWithId, Session } from '../model/Session';
import { extractDocumentData } from '../api/helpers';
import { setGameSession } from './session/actions';
import { setPlayerId } from './playerHand/actions';
import { ENTRANCE_ROUTE } from '../App';

type Props = {
  children: React.ReactNode;
};

export function PersistGate(props: Props) {
  const [isReady, setReadyStatus] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // We don't need to persist on the initial route
    if (window.location.pathname === ENTRANCE_ROUTE) {
      setReadyStatus(true);
    } else {
      loadSession().then(sessionO => {
        pipe(
          sessionO,
          O.fold(
            () => setReadyStatus(true),
            ({ session, playerId }) => {
              batch(() => {
                dispatch(setGameSession(session));
                dispatch(setPlayerId(playerId));
              });
              setReadyStatus(true);
            },
          ),
        );
      });
    }
  }, [dispatch]);

  if (!isReady) {
    return null;
  }

  return <>{props.children}</>;
}

export async function loadSession(): Promise<O.Option<{ session: LocalSessionWithId; playerId: string }>> {
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
