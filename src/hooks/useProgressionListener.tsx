import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as A from 'fp-ts/lib/Array';
import { eqString } from 'fp-ts/lib/Eq';

import { getSessionValue } from '../store/session/selectors';
import { getPlayerHandIds, getPlayerValue } from '../store/playerHand/selector';
import { getPlayerHand } from '../store/playerHand/actions';
import { requestPlayerHandListener, requestProgressionListener } from '../api/db/gameSession';
import { setGameProgression } from '../store/session/actions';

export function useProgressionListener() {
  const currentSession = useSelector(getSessionValue);
  const [hasListener, setHasListener] = useState<boolean>(false);
  const [currPlayerHand, setCurrPlayerHand] = useState<string[]>([]);
  const dispatch = useDispatch();

  // //Player hand listener
  useEffect(() => {
    if (currentSession.id && !hasListener && currentSession.status === 'STARTED') {
      setHasListener(true);
      // const totalPlays = Object.keys(currentSession.progression).length;

      requestProgressionListener(currentSession.id, progression => {
        dispatch(setGameProgression(progression));
      });
    }
  }, [currentSession.id, hasListener, dispatch]);
}
