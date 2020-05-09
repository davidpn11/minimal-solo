import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSession } from '../store/session/selectors';
import { requestSessionPlayersListener, requestTogglePlayerStatus } from '../api/db/preGameSession';
import { addNewPlayer, clearSession, startGameSession } from '../store/session/actions';
import { PlayerStatus } from '../model/Player';

//TODO RENAME THIS
export function useMatchMaker() {
  const currentSession = useSelector(getSession);
  const dispatch = useDispatch();
  const [hasListener, setHasListener] = useState<boolean>(false);

  //Player listener
  useEffect(() => {
    if (currentSession.id && !hasListener) {
      setHasListener(true);
      requestSessionPlayersListener(currentSession.id, p => dispatch(addNewPlayer(p)));
    }
    return () => {
      dispatch(clearSession);
    };
  }, [currentSession.id, hasListener, dispatch]);

  const toggleStatus = (playerId: string, playerStatus: PlayerStatus) => async () => {
    await requestTogglePlayerStatus(currentSession.id, playerId, playerStatus);
  };

  const startGame = () => {
    dispatch(startGameSession());
    console.log('startGame');
  };

  return { toggleStatus, startGame };
}
