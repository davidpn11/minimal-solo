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
import { unitJSX } from '../utils/unit';

export default function App() {
  const currentSessionO = useSelector(getSession);
  const dispatch = useDispatch();
  const history = useHistory();

  const match = useRouteMatch<{ code: string }>();

  useEffect(() => {
    pipe(match.params.code, getFullSessionByCode)
      .then(session => dispatch(setGameSession(session)))
      .catch(err => {
        console.error(err);
        return history.push('/');
      });
  }, [match.params, dispatch, history]);

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
            return <Game />;
          default:
            throw new Error('Not a valid session status');
        }
      },
    ),
  );
}
