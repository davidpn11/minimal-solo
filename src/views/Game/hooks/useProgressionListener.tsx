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
import { CommonNumberCardPlay, isCardPlay, isPass, PlayWithId } from '../../../model/Play';
import { noop } from '../../../utils/unit';
import { isOwnerOfPlay, getNextPlayer } from '../helpers/plays';
import { getPlayerValue } from '../../../store/playerHand/selector';
import { isCommonNumberCard } from '../../../model/Card';

export function useProgressionListener() {
  const player = useSelector(getPlayerValue);
  const currentSession = useSelector(getStartedSession);
  const currentPlay = useSelector(getCurrentPlay);
  const currentPlayer = useSelector(getCurrentPlayer);
  const orderedProgression = useSelector(getOrderedProgression);
  const [hasListener, setHasListener] = useState<boolean>(false);
  const dispatch = useDispatch();

  function runNextEffect(play: PlayWithId) {
    const nextPlayer = getNextPlayer(play, currentSession);

    batch(() => {
      dispatch(setCurrentPlay(play.id));
      dispatch(setCurrentPlayer(nextPlayer.id));
    });
  }

  function runCardPlayEffect(play: CommonNumberCardPlay) {
    const nextPlayer = getNextPlayer(play, currentSession);

    if (isCommonNumberCard(play.card.value)) {
      batch(() => {
        dispatch(setCurrentPlay(play.id));
        dispatch(setCurrentPlayer(nextPlayer.id));
        dispatch(setCurrentCard(play.card.value));
      });
    }
  }

  function runPostPlayHook(play: PlayWithId) {
    if (isPass(play)) return runNextEffect(play);
    if (isCardPlay(play)) return runCardPlayEffect(play as CommonNumberCardPlay);
  }

  const handleLastPlay = useCallback(
    (play: PlayWithId, playerId: string) => {
      runPostPlayHook(play);

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
