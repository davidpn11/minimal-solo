import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSession } from '../store/session/selectors';
import { requestSessionStatusListener } from '../api/db/preGameSession';
import { LocalSessionWithId } from '../model/Session';
import { setGameSession } from '../store/session/actions';
import { getPlayerHandIds } from '../store/playerHand/selector';

export function useSessionListener() {
  const currentSession = useSelector(getSession);
  const playerHand = useSelector(getPlayerHandIds);
  const dispatch = useDispatch();
  const [hasListener, setHasListener] = useState<boolean>(false);

  useEffect(() => {
    console.log({ playerHand });
  }, [playerHand]);
}
