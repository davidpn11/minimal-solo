import React, { useEffect, useState } from 'react';
import { batch, useDispatch } from 'react-redux';
import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';

import { LoadSession, loadSessionFromCache } from './helpers';
import { setGameSession } from '../session/actions';
import { setPlayerId } from '../playerHand/actions';
import { ENTRANCE_ROUTE } from '../../App';
import { unitJSX } from '../../utils/unit';

type Props = {
  children: React.ReactNode;
};

export function PersistGate(props: Props) {
  const [isReady, setReadyStatus] = useState<boolean>(false);
  const dispatch = useDispatch();

  function rehydrateSessionFromStorage({ session, playerId }: LoadSession) {
    batch(() => {
      dispatch(setGameSession(session));
      dispatch(setPlayerId(playerId));
    });
    setReadyStatus(true);
  }

  useEffect(() => {
    // We don't need to persist on the initial route
    if (window.location.pathname === ENTRANCE_ROUTE) {
      setReadyStatus(true);
    } else {
      loadSessionFromCache().then(sessionO => {
        pipe(
          sessionO,
          O.fold(() => setReadyStatus(true), rehydrateSessionFromStorage),
        );
      });
    }
  }, [dispatch]);

  if (!isReady) {
    return unitJSX;
  }

  return <>{props.children}</>;
}
