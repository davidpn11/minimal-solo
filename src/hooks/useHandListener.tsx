import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as A from 'fp-ts/lib/Array';
import { eqString } from 'fp-ts/lib/Eq';

import { getSessionValue } from '../store/session/selectors';
import { getPlayerHandIds, getPlayerValue } from '../store/playerHand/selector';
import { getPlayerHand } from '../store/playerHand/actions';
import { requestPlayerHandListener } from '../api/db/gameSession';

export function useHandListener() {
  const currentSession = useSelector(getSessionValue);
  const playerHand = useSelector(getPlayerHandIds);
  const player = useSelector(getPlayerValue);
  const [hasListener, setHasListener] = useState<boolean>(false);
  const [currPlayerHand, setCurrPlayerHand] = useState<string[]>([]);
  const dispatch = useDispatch();
  const ArrayEq = A.getEq(eqString);

  useEffect(() => {
    if (!ArrayEq.equals(currPlayerHand, playerHand)) {
      setCurrPlayerHand(playerHand);
      dispatch(getPlayerHand(currentSession.id, playerHand));
    }
  }, [playerHand]);

  //Player hand listener
  useEffect(() => {
    if (currentSession.id && !hasListener) {
      setHasListener(true);
      if (player) {
        requestPlayerHandListener(player.id, currentSession.id, hand =>
          dispatch(getPlayerHand(currentSession.id, hand)),
        );
      }
    }
  }, [currentSession.id, hasListener, dispatch]);

  return { playerHand };
}
