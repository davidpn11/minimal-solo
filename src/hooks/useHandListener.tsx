import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { eqString } from 'fp-ts/lib/Eq';

import { getSessionValue } from '../store/session/selectors';
import { getPlayerHandIds, getPlayer } from '../store/playerHand/selector';
import { getPlayerHand } from '../store/playerHand/actions';
import { requestPlayerHandListener } from '../api/db/gameSession';

export function useHandListener() {
  const currentSession = useSelector(getSessionValue);
  const playerHand = useSelector(getPlayerHandIds);
  const player = useSelector(getPlayer);
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
      if (O.isSome(player.id)) {
        requestPlayerHandListener(player.id.value, currentSession.id, hand =>
          dispatch(getPlayerHand(currentSession.id, hand)),
        );
      }
    }
  }, [currentSession.id, hasListener, dispatch]);

  return { playerHand };
}
