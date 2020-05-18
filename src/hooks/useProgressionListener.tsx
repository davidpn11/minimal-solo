import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getSessionValue } from '../store/session/selectors';
import { requestProgressionListener } from '../api/db/gameSession';
import { setGameProgression } from '../store/session/actions';

export function useProgressionListener() {
  const currentSession = useSelector(getSessionValue);
  const [hasListener, setHasListener] = useState<boolean>(false);
  const dispatch = useDispatch();

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
