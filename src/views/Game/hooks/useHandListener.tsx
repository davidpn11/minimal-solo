import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as A from 'fp-ts/lib/Array';
import { eqString } from 'fp-ts/lib/Eq';

import {
  getCurrentSessionPlayer,
  getLastPlayPosition,
  getPlayerActions,
  getSessionValue,
} from '../../../store/session/selectors';
import { getPlayerHandIds, getPlayerValue } from '../../../store/playerHand/selector';
import { getPlayerHand } from '../../../store/playerHand/actions';
import { requestPlayerHandListener } from '../../../api/db/gameSession';
import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';
import { createPassPlay } from '../../../model/Play';
import { addPlay } from '../../../store/session/actions';

const ArrayEq = A.getEq(eqString);

export function useHandListener() {
  const currentSession = useSelector(getSessionValue);
  const currentSessionPlayer = useSelector(getCurrentSessionPlayer);
  const player = useSelector(getPlayerValue);
  const playerHand = useSelector(getPlayerHandIds);
  const playerActions = useSelector(getPlayerActions);
  const lastPlayPosition = useSelector(getLastPlayPosition);
  const [hasListener, setHasListener] = useState<boolean>(false);
  const [currPlayerHand, setCurrPlayerHand] = useState<string[]>([]);
  const dispatch = useDispatch();

  function handlePass() {
    pipe(
      currentSessionPlayer,
      O.fold(
        () => {
          throw new Error('Cannot pass without a section player.');
        },
        sessionPlayer => {
          const play = createPassPlay({ id: player.id, ...sessionPlayer }, lastPlayPosition + 1);
          dispatch(addPlay(play));
        },
      ),
    );
  }

  useEffect(() => {
    if (!ArrayEq.equals(currPlayerHand, playerHand)) {
      setCurrPlayerHand(playerHand);
      dispatch(getPlayerHand(currentSession.id, playerHand));
    }
  }, [playerHand]);

  //Player hand listener
  useEffect(() => {
    if (currentSession.id && !hasListener) {
      setHasListener(true);
      if (player) {
        requestPlayerHandListener(player.id, currentSession.id, hand =>
          dispatch(getPlayerHand(currentSession.id, hand)),
        );
      }
    }
  }, [currentSession.id, hasListener, dispatch]);

  return { playerHand, playerActions, handlePass };
}
