import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

import { getSessionValue } from '../store/session/selectors';
import { LocalSessionWithId } from '../model/Session';
import { setGameSession } from '../store/session/actions';
import { setSentrySessionTags } from '../utils/sentry';
import { getSessionRef } from '../api/firebase';
import { extractDocumentData } from '../api/helpers';
import { noop } from '../utils/unit';

export function useSessionListener() {
  const currentSession = useSelector(getSessionValue);
  const dispatch = useDispatch();

  useEffect(function syncSession() {
    const unsubscribe = getSessionRef(currentSession.id).onSnapshot(documentSnapshot => {
      const newSession = extractDocumentData<LocalSessionWithId>(documentSnapshot);

      pipe(
        newSession,
        O.fold(noop, updateSession => {
          if (updateSession.status !== currentSession.status) {
            dispatch(setGameSession(updateSession));
            setSentrySessionTags(updateSession);
          }
        }),
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { currentSession };
}
