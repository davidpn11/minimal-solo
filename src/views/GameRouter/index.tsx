import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

import { BoardWrapper, GameWrapper, Main } from './styles';
import Lobby from '../Lobby';
import GameEngine from '../../GameEngine';
import GameTable from './components/GameTable';
import { PlayerHand } from '../../components/PlayerHand';
import { Side } from '../../components/Side';
import { getAllPlayers, getSession } from '../../store/session/selectors';
import { getPlayer, getPlayerIdValue } from '../../store/playerHand/selector';
import { unitJSX } from '../../utils/unit';
import { getFullSessionByCode } from '../../api/firebase';
import { setGameSession } from '../../store/session/actions';

export default function GameRouter() {
  const currentSessionO = useSelector(getSession);
  const playerO = useSelector(getPlayer);
  const dispatch = useDispatch();
  const history = useHistory();
  const players = useSelector(getAllPlayers);
  const currentPlayerId = useSelector(getPlayerIdValue);
  const isPlaying = Object.keys(players).some(playerId => playerId === currentPlayerId);

  const match = useRouteMatch<{ code: string }>();

  useEffect(() => {
    pipe(match.params.code, getFullSessionByCode)
      .then(session => dispatch(setGameSession(session)))
      .catch(err => {
        console.error(err);
        return history.push('/');
      });
  }, [match.params]);

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
            if (!isPlaying) {
              history.push('/');
              return unitJSX;
            }

            return pipe(
              playerO,
              O.fold(
                () => unitJSX,
                player => (
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
                ),
              ),
            );
          default:
            throw new Error('Not a valid session status');
        }
      },
    ),
  );
}
