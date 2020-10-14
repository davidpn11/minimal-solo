import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch, batch } from 'react-redux';
import { pipe } from 'fp-ts/lib/pipeable';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';

import {
  getCurrentPlay,
  getCurrentPlayer,
  getOrderedProgression,
  getStartedSession,
} from '../../../store/session/selectors';
import { requestProgressionListener } from '../../../api/db/gameSession';
import {
  setCurrentCard,
  setCurrentPlay,
  setCurrentPlayer,
  setGameProgression,
} from '../../../store/session/actions';
import { PlayWithId, isCardPlay, isPass } from '../../../model/Play';
import { noop } from '../../../utils/unit';
import { isOwnerOfPlay, getNextPlayer } from '../helpers/plays';
import { getPlayerValue } from '../../../store/playerHand/selector';
import { isCommonNumberCard } from '../../../model/Card';
import { ID } from '../../../model/Session';
import { foldPlayWithId } from '../../../store/playerHand/helpers/foldPlay';

export function useProgressionListener() {
  const player = useSelector(getPlayerValue);
  const currentSession = useSelector(getStartedSession);
  const currentPlay = useSelector(getCurrentPlay);
  const currentPlayer = useSelector(getCurrentPlayer);
  const orderedProgression = useSelector(getOrderedProgression);
  const [hasListener, setHasListener] = useState<boolean>(false);
  const dispatch = useDispatch();

  const runNextEffect = useCallback(
    (play: PlayWithId) => {
      const nextPlayer = getNextPlayer(play, currentSession);

      batch(() => {
        dispatch(setCurrentPlay(play.id));
        dispatch(setCurrentPlayer(nextPlayer.id));
      });
    },
    [dispatch, currentSession],
  );

  //TODO CHECK THIS LOGIC
  const runCardPlayEffect = useCallback(
    (play: PlayWithId) => {
      if (isCardPlay(play)) {
        dispatch(setCurrentCard(play.card));
        runNextEffect(play);
      }
    },
    [dispatch, runNextEffect],
  );

  const runPostPlayHook = useCallback(
    (play: PlayWithId) => {
      if (isPass(play)) {
        return runNextEffect(play);
      }
      // if (isCardPlay(play)) return runCardPlayEffect(play as CommonNumberCardPlay);
    },
    [runNextEffect, runCardPlayEffect],
  );

  const handleLastPlay = useCallback(
    (play: PlayWithId, playerId: string) => {
      runPostPlayHook(play);
      //TODO Run game state reader

      if (isOwnerOfPlay(play, playerId)) {
        console.log('owner');
      }
    },
    [runPostPlayHook],
  );

  useEffect(() => {
    if (currentSession.id && !hasListener && currentSession.status === 'STARTED') {
      setHasListener(true);
      // const totalPlays = Object.keys(currentSession.progression).length;

      requestProgressionListener(currentSession.id, progression => {
        dispatch(setGameProgression(progression));
      });
    }
  }, [currentSession.id, currentSession.status, hasListener, dispatch]);

  useEffect(() => {
    return pipe(
      A.last(orderedProgression),
      O.fold(noop, play => {
        if (currentPlay !== play.id) {
          handleLastPlay(play, player.id);
        }
      }),
    );
  }, [orderedProgression, currentPlay, player, handleLastPlay]);

  return {
    isCurrentPlayer: currentPlayer === player.id,
  };
}
