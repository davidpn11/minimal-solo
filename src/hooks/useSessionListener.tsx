import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as O from 'fp-ts/lib/Option';

import { getSession } from '../store/session/selectors';
import { requestSessionStatusListener } from '../api/db/preGameSession';
import { LocalSessionWithId } from '../model/Session';
import { setGameSession } from '../store/session/actions';
import { setSentrySessionTags } from '../utils/sentry';

export function useSessionListener() {
  const currentSession = useSelector(getSession);
  const dispatch = useDispatch();
  const [hasListener, setHasListener] = useState<boolean>(false);

  useEffect(() => {
    if (O.isSome(currentSession) && !hasListener) {
      setHasListener(true);
      requestSessionStatusListener(currentSession.value.id, (newSession: LocalSessionWithId) => {
        if (newSession.status !== currentSession.value.status) {
          dispatch(setGameSession(newSession));
          setSentrySessionTags(newSession);
        }
      });
    }
  }, [currentSession, hasListener, dispatch]);
}
