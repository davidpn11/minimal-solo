import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

import { Lobby } from './Lobby';
import { Game } from './Game';
import { getFullSessionByCode } from '../api/firebase';
import { getSession } from '../store/session/selectors';
import { setGameSession } from '../store/session/actions';
import { getPlayerValue } from '../store/playerHand/selector';
import { isPlayerInTheGame } from '../store/playerHand/helpers/player';
import { noop, unitJSX } from '../utils/unit';
import { captureLog } from '../utils/sentry';

export default function App() {
  const currentSessionO = useSelector(getSession);
  const player = useSelector(getPlayerValue);
  const dispatch = useDispatch();
  const history = useHistory();

  const match = useRouteMatch<{ code: string }>();

  useEffect(() => {
    pipe(match.params.code, getFullSessionByCode)
      .then(session => dispatch(setGameSession(session)))
      .catch(err => {
        captureLog(err);
        return history.push('/');
      });
  }, [match.params, dispatch, history]);

  useEffect(() => {
    pipe(
      currentSessionO,
      O.fold(noop, session => {
        if (session.status === 'STARTED' && !isPlayerInTheGame(player, session)) {
          history.push('/');
        }
      }),
    );
  }, [currentSessionO, player, history]);

  return pipe(
    currentSessionO,
    O.fold(
      () => unitJSX,
      session => {
        switch (session.status) {
          case 'INITIAL':
          case 'STARTING':
            return <Lobby status={session.status} />;
          case 'STARTED':
            if (isPlayerInTheGame(player, session)) {
              return <Game />;
            }
            return unitJSX;
          default:
            throw new Error('Not a valid session status');
        }
      },
    ),
  );
}
