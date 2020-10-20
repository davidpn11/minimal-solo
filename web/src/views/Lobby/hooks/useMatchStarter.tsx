import { useSelector, useDispatch } from 'react-redux';

import { getSession } from '../../../store/session/selectors';
import { requestTogglePlayerStatus } from '../../../api/db/preGameSession';
import { startGameSession } from '../../../store/session/actions';
import { usePlayersListener } from '../../Game/hooks/usePlayersListener';

export function useMatchStarter() {
  const currentSession = useSelector(getSession);
  const dispatch = useDispatch();
  const isStarting = currentSession.status === 'STARTING';
  usePlayersListener();

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
