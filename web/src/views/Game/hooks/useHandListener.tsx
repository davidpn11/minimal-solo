import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getCurrentCard,
  getCurrentPlayer,
  getCurrentSessionPlayerValue,
  getLastPlayPosition,
  getNextPlayer,
  getPlayerActions,
  getSession,
} from '../../../store/session/selectors';
import { getPlayerHandIds, getPlayerValue } from '../../../store/playerHand/selector';
import { getPlayerHand } from '../../../store/playerHand/actions';
import { requestPlayerHandListener } from '../../../api/db/gameSession';
export function useHandListener() {
  const player = useSelector(getPlayerValue);
  const playerHand = useSelector(getPlayerHandIds);
  const playerActions = useSelector(getPlayerActions);
  const lastPlayPosition = useSelector(getLastPlayPosition);
  const currentCard = useSelector(getCurrentCard);
  const currentPlayer = useSelector(getCurrentPlayer);
  const nextPlayer = useSelector(getNextPlayer);
  const currentSession = useSelector(getSession);
  const currentSessionPlayer = useSelector(getCurrentSessionPlayerValue);
  const currentSessionPlayerWithId = { ...currentSessionPlayer, id: player.id };
  const isYourTurn = useMemo<boolean>(() => player.id === currentPlayer, [player, currentPlayer]);
  const [hasListener, setHasListener] = useState<boolean>(false);
  const [hasDrawed, setHasDrawed] = useState<boolean>(false);
  const dispatch = useDispatch();

  //Player hand listener
  useEffect(() => {
    if (currentSession.id && !hasListener) {
      setHasListener(true);
      if (player) {
        requestPlayerHandListener(player.id, currentSession.id, hand => {
          dispatch(getPlayerHand(currentSession.id, hand));
        });
      }
    }
  }, [currentSession.id, hasListener, player, dispatch]);

  return { playerHand, playerActions };
}

// Pre        ---   Game   --   Post
// canPlayType |            |   play types
// canPlayFold |            |   play fold
// useHandListener |        |   useProgressionListener
