import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import * as O from 'fp-ts/lib/Option';
import * as R from 'fp-ts/lib/Record';
import { pipe } from 'fp-ts/lib/pipeable';

import { BoardWrapper, GameWrapper, Main } from './styles';
import Lobby from '../Lobby';
import GameEngine from '../../GameEngine';
import GameTable from './components/GameTable';
import { PlayerHand } from '../../components/PlayerHand';
import { Side } from '../../components/Side';
import { getSession } from '../../store/session/selectors';
import { useSessionListener } from '../../hooks/useSessionListener';
import { getPlayerValue } from '../../store/playerHand/selector';
import { noop, unitJSX } from '../../utils/unit';
import { getSessionRef, getSessionRefByCode } from '../../api/firebase';
import { normalizeQuery } from '../../api/helpers';
import { LocalSession, LocalSessionWithId } from '../../model/Session';
import { setGameSession } from '../../store/session/actions';
import { SessionPlayer } from '../../model/Player';

export default function GameRouter() {
  const currentSession = useSelector(getSession);
  const player = useSelector(getPlayerValue);
  const dispatch = useDispatch();
  useSessionListener();

  const match = useRouteMatch<{ code: string }>();

  useEffect(() => {
    pipe(match.params.code, getSessionRefByCode)
      .get()
      .then(sessionByCode => {
        pipe(
          normalizeQuery<LocalSession>(sessionByCode),
          R.reduceWithIndex<string, LocalSession, O.Option<LocalSessionWithId>>(
            O.none,
            (id, acc, localSession) =>
              O.some({
                ...localSession,
                id,
              }),
          ),
          O.fold(noop, async localSession => {
            const players = normalizeQuery<SessionPlayer>(
              await getSessionRef(localSession.id).collection('players').get(),
            );
            dispatch(setGameSession({ ...localSession, players }));
          }),
        );
      });
  }, [match.params]);

  return pipe(
    currentSession,
    O.fold(
      () => {
        // history.push('/');
        return unitJSX;
      },
      session => {
        switch (session.status) {
          case 'INITIAL':
            return <Lobby />;
          case 'STARTED':
            return (
              <GameEngine>
                <GameWrapper>
                  <Main>
                    <BoardWrapper>
                      <GameTable />
                    </BoardWrapper>
                    {/* These props will come from the Engine */}
                    <PlayerHand pass="CANNOT_PASS" solo="CANNOT_SOLO" cards={player.hand} />
                  </Main>
                  <Side />
                </GameWrapper>
              </GameEngine>
            );
          default:
            throw new Error('Not a valid session status');
        }
      },
    ),
  );
}
