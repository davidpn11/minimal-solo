import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { normalizeQuery } from '@mikelfcosta/solo-lib/lib/utils/firebase';
import { getSessionRef } from '../../../api/firebase';
import { setPlayers } from '../../../store/session/actions';
import { getSession } from '../../../store/session/selectors';

export function usePlayersListener() {
  const currentSession = useSelector(getSession);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = getSessionRef(currentSession.id)
      .collection('players')
      .onSnapshot(querySnapshot => {
        const players = normalizeQuery<SessionPlayer>(querySnapshot);
        dispatch(setPlayers(players));
      });

    return () => {
      unsubscribe();
    };
  }, []);
}
