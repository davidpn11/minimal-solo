import React, { useEffect, useState } from 'react';
import { batch, useDispatch } from 'react-redux';
import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';

import { loadSession } from './helpers';
import { ENTRANCE_ROUTE } from '../../App';
import { setGameSession } from '../session/actions';
import { setPlayerId } from '../playerHand/actions';

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
