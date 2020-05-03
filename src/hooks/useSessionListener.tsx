import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSession } from "../store/session/selectors";
import { requestSessionStatusListener } from "../api/db/session";
import { LocalSessionWithId } from "../model/Session";
import { setGameSession } from "../store/session/actions";

export function useSessionListener() {
  const currentSession = useSelector(getSession);
  const dispatch = useDispatch();
  const [hasListener, setHasListener] = useState<boolean>(false);

  useEffect(() => {
    if (currentSession.id && !hasListener) {
      setHasListener(true);
      requestSessionStatusListener(
        currentSession.id,
        (newSession: LocalSessionWithId) => {
          if (newSession.status !== currentSession.status) {
            dispatch(setGameSession(newSession));
          }
        }
      );
    }
  }, [currentSession, hasListener, dispatch]);
}
