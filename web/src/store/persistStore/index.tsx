import React, { useCallback, useEffect, useState } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';

import { LoadSession, loadSessionFromCache } from './helpers';
import { setGameSession } from '../session/actions';
import { setPlayerId } from '../playerHand/actions';
import { unitJSX } from '../../utils/unit';
import { getFullSessionByCode, getUniqueId } from '../../api/firebase';
import { safeSetItem } from '../../utils/storage';
import { captureLog, setSentryUserContext } from '../../utils/sentry';
import { getSession } from '../session/selectors';
import { getPlayer } from '../playerHand/selector';

type Props = {
  children: React.ReactNode;
};

export function PersistGate(props: Props) {
  const sessionO = useSelector(getSession);
  const playerO = useSelector(getPlayer);
  const isReady = O.isSome(playerO);
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch<{ code: string }>('/room/:code');

  useEffect(function rehydrateSession() {
    if (match) {
      getFullSessionByCode(match.params.code)
        .then(session => dispatch(setGameSession(session)))
        .catch(err => {
          captureLog(err);
          return history.push('/');
        });
    }
  }, []);

  const setNewStorage = useCallback(() => {
    const newPlayerId = getUniqueId();
    dispatch(setPlayerId(newPlayerId));
    safeSetItem('playerId', newPlayerId);
    setSentryUserContext(newPlayerId);
  }, [dispatch]);

  const rehydrateSessionFromStorage = useCallback(
    ({ session, playerId }: LoadSession) => {
      batch(() => {
        dispatch(setGameSession(session));
        dispatch(setPlayerId(playerId));
      });
      setSentryUserContext(playerId);
    },
    [dispatch],
  );

  useEffect(() => {
    loadSessionFromCache().then(sessionO => {
      pipe(sessionO, O.fold(setNewStorage, rehydrateSessionFromStorage));
    });
  }, [setNewStorage, rehydrateSessionFromStorage, dispatch]);

  if (!isReady) {
    return unitJSX;
  }

  if (match && O.isNone(sessionO)) {
    return unitJSX;
  }

  return <>{props.children}</>;
}
