import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { extractDocumentData } from 'solo-lib/lib/utils/firebase';
import { getSessionRef } from '../../../api/firebase';
import { getPlayerHand } from '../../../store/playerHand/actions';
import { getPlayerHandIds, getPlayerValue } from '../../../store/playerHand/selector';
import { getPlayerActions, getSession } from '../../../store/session/selectors';

export function useHandListener() {
  const player = useSelector(getPlayerValue);
  const playerHand = useSelector(getPlayerHandIds);
  const playerActions = useSelector(getPlayerActions);
  const currentSession = useSelector(getSession);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = getSessionRef(currentSession.id)
      .collection('players')
      .doc(player.id)
      .onSnapshot(documentSnapshot => {
        const player = extractDocumentData<SessionPlayer>(documentSnapshot);
        pipe(
          player,
          O.fold(
            () => {
              throw new Error('No Player');
            },
            p => {
              dispatch(getPlayerHand(currentSession.id, p.hand));
            },
          ),
        );
      });
    return () => {
      unsubscribe();
    };
  }, [currentSession.id, player, dispatch]);

  return { playerHand, playerActions };
}

// Pre        ---   Game   --   Post
// canPlayType |            |   play types
// canPlayFold |            |   play fold
// useHandListener |        |   useProgressionListener
