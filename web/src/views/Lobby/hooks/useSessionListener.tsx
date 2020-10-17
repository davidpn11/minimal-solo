import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getSessionValue } from '../../../store/session/selectors';
import { requestSessionStatusListener } from '../../../api/db/preGameSession';
import { LocalSessionWithId } from '../../../model/Session';
import { setGameSession } from '../../../store/session/actions';
import { setSentrySessionTags } from '../../../utils/sentry';

export function useSessionListener() {
  const currentSession = useSelector(getSessionValue);
  const [hasListener, setHasListener] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!hasListener) {
      setHasListener(true);

      requestSessionStatusListener(currentSession.id, (newSession: LocalSessionWithId) => {
        if (newSession.status !== currentSession.status) {
          dispatch(setGameSession(newSession));
          setSentrySessionTags(newSession);
        }
      });
    }
  }, [currentSession, hasListener, dispatch]);

  return { currentSession };
}
