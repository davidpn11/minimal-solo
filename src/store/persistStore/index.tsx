import React, { useEffect, useState } from 'react';
import { batch, useDispatch } from 'react-redux';
import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';

import { LoadSession, loadSessionFromCache } from './helpers';
import { setGameSession } from '../session/actions';
import { setPlayerId } from '../playerHand/actions';
import { unitJSX } from '../../utils/unit';
import { getUniqueId } from '../../api/firebase';
import { safeSetItem } from '../../utils/storage';

type Props = {
  children: React.ReactNode;
};

export function PersistGate(props: Props) {
  const [isReady, setReadyStatus] = useState<boolean>(false);
  const dispatch = useDispatch();

  function setNewStorage() {
    const newPlayerId = getUniqueId();
    dispatch(setPlayerId(newPlayerId));
    safeSetItem('playerId', newPlayerId);
    setReadyStatus(true);
  }

  function rehydrateSessionFromStorage({ session, playerId }: LoadSession) {
    batch(() => {
      dispatch(setGameSession(session));
      dispatch(setPlayerId(playerId));
    });
    setReadyStatus(true);
  }

  useEffect(() => {
    loadSessionFromCache().then(sessionO => {
      pipe(sessionO, O.fold(setNewStorage, rehydrateSessionFromStorage));
    });
  }, [dispatch]);

  if (!isReady) {
    return unitJSX;
  }

  return <>{props.children}</>;
}
