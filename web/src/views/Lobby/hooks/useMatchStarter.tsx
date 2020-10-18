import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getSessionValue } from '../../../store/session/selectors';
import {
  requestSessionPlayersListener,
  requestTogglePlayerStatus,
} from '../../../api/db/preGameSession';
import { setPlayers, clearSession, startGameSession } from '../../../store/session/actions';

export function useMatchStarter() {
  const currentSession = useSelector(getSessionValue);
  const dispatch = useDispatch();
  const [hasListener, setHasListener] = useState<boolean>(false);
  const isStarting = currentSession.status === 'STARTING';

  //Player listener
  useEffect(() => {
    if (!hasListener) {
      setHasListener(true);
      requestSessionPlayersListener(currentSession.id, p => dispatch(setPlayers(p)));
    }
    return () => {
      dispatch(clearSession);
    };
  }, [currentSession, hasListener, dispatch]);

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
