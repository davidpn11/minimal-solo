import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSession } from '../store/session/selectors';
import { getPlayerHandIds, getPlayer } from '../store/playerHand/selector';
import * as A from 'fp-ts/lib/Array';
import { eqString } from 'fp-ts/lib/Eq';
import { getPlayerHand } from '../store/playerHand/actions';

export function useHandListener() {
  const currentSession = useSelector(getSession);
  const playerHand = useSelector(getPlayerHandIds);
  const player = useSelector(getPlayer);
  const [currPlayerHand, setCurrPlayerHand] = useState<string[]>([]);
  const dispatch = useDispatch();
  const E = A.getEq(eqString);

  useEffect(() => {
    if (!E.equals(currPlayerHand, playerHand)) {
      setCurrPlayerHand(playerHand);
      dispatch(getPlayerHand(currentSession.id, playerHand));
    }
  }, [playerHand]);
  return { playerHand };
}
