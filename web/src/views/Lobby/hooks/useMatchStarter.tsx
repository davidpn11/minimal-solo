import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { normalizeQuery } from 'solo-lib/lib/utils/firebase';

import { getSession } from '../../../store/session/selectors';
import { requestTogglePlayerStatus } from '../../../api/db/preGameSession';
import { setPlayers, startGameSession } from '../../../store/session/actions';
import { getSessionRef } from '../../../api/firebase';

export function useMatchStarter() {
  const currentSession = useSelector(getSession);
  const dispatch = useDispatch();
  const isStarting = currentSession.status === 'STARTING';

  //Player listener
  useEffect(() => {
    const unsubscribe = getSessionRef(currentSession.id)
      .collection('players')
      .onSnapshot(querySnapshot => {
        const players = normalizeQuery<SessionPlayer>(querySnapshot);
        dispatch(setPlayers(players));
      });

    return () => {
      unsubscribe();
    };
  }, []);

  function toggleStatus(playerId: string, playerStatus: PlayerStatus) {
    return async () => {
      await requestTogglePlayerStatus(currentSession.id, playerId, playerStatus);
    };
  }

  function startGame() {
    dispatch(startGameSession(currentSession.id));
  }

  return { isStarting, toggleStatus, startGame };
}
