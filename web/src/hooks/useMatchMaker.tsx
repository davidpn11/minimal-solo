import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getSessionValue } from '../store/session/selectors';
import { requestSessionPlayersListener, requestTogglePlayerStatus } from '../api/db/preGameSession';
import { addNewPlayer, clearSession, startGameSession } from '../store/session/actions';
import { PlayerStatus } from '../model/Player';

//TODO RENAME THIS
export function useMatchMaker() {
  const currentSession = useSelector(getSessionValue);
  const dispatch = useDispatch();
  const [hasListener, setHasListener] = useState<boolean>(false);

  //Player listener
  useEffect(() => {
    if (!hasListener) {
      setHasListener(true);
      requestSessionPlayersListener(currentSession.id, p => dispatch(addNewPlayer(p)));
    }
    return () => {
      dispatch(clearSession);
    };
  }, [currentSession, hasListener, dispatch]);

  const toggleStatus = (playerId: string, playerStatus: PlayerStatus) => async () => {
    await requestTogglePlayerStatus(currentSession.id, playerId, playerStatus);
  };

  const startGame = () => {
    dispatch(startGameSession(currentSession.id));
  };

  return { toggleStatus, startGame };
}
