import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { getSessionState } from '../session/selectors';
import { getPlayer } from '../playerHand/selector';

type Props = {
  children: React.ReactNode;
};

export function PersistGate(props: Props) {
  const session = useSelector(getSessionState);
  const playerO = useSelector(getPlayer);
  const isReady = O.isSome(playerO);
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch<{ code: string }>('/room/:code');

  function rehydrateSession(code: string) {
    getFullSessionByCode(code)
      .then(session => dispatch(setGameSession(session)))
      .catch(err => {
        captureLog(err);
        return history.push('/');
      });
  }

  useEffect(() => {
    if (match) {
      rehydrateSession(match.params.code);
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
      dispatch(setPlayerId(playerId));
      if (match && match.params.code !== session.code) {
        rehydrateSession(match.params.code);
      } else {
        dispatch(setGameSession(session));
      }
      setSentryUserContext(playerId);
    },
    [dispatch],
  );

  useEffect(() => {
    loadSessionFromCache().then(session => {
      pipe(session, O.fold(setNewStorage, rehydrateSessionFromStorage));
    });
  }, [setNewStorage, rehydrateSessionFromStorage, dispatch]);

  if (!isReady) {
    return unitJSX;
  }

  if (match && session.status === 'INITIAL') {
    return unitJSX;
  }

  return <>{props.children}</>;
}
