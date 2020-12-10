import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { extractDocumentData } from '@mikelfcosta/solo-lib/lib/utils/firebase';

import { getSession } from '../store/session/selectors';
import { setGameSession } from '../store/session/actions';
import { setSentrySessionTags } from '../utils/sentry';
import { getSessionRef } from '../api/firebase';
import { noop } from '../utils/unit';

export function useSessionListener() {
  const currentSession = useSelector(getSession);
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
