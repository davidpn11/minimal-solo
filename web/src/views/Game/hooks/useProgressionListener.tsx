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
import { PlayWithId, BlockPlay, NumberCardPlay, DrawPlay, Play } from '../../../model/Play';
import { noop } from '../../../utils/unit';
import { isOwnerOfPlay, getNextPlayerByPlay } from '../helpers/plays';
import { getPlayerValue } from '../../../store/playerHand/selector';
import { foldPlayWithId } from '../../../store/playerHand/helpers/foldPlay';

export function useProgressionListener() {
  const player = useSelector(getPlayerValue);
  const currentSession = useSelector(getStartedSession);
  const currentPlay = useSelector(getCurrentPlay);
  const currentPlayer = useSelector(getCurrentPlayer);
  const orderedProgression = useSelector(getOrderedProgression);
  const [hasListener, setHasListener] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleLastPlay = useCallback(
    (play: PlayWithId, playerId: string) => {
      function runNextEffect(play: PlayWithId) {
        const nextPlayer = getNextPlayerByPlay(play, currentSession);

        batch(() => {
          dispatch(setCurrentPlay(play.id));
          dispatch(setCurrentPlayer(nextPlayer.id));
        });
      }

      function runBlockCardEffect(play: BlockPlay & ID) {
        dispatch(setCurrentCard(play.card));
        runNextEffect(play);
      }

      function runNumberCardPlayEffect(play: NumberCardPlay & ID) {
        dispatch(setCurrentCard(play.card));
        runNextEffect(play);
      }

      function runDrawCardPlayEffect(play: DrawPlay & ID) {
        //TODO Will be useful for animations
        // dispatch(setCurrentPlay(play.id));
        /**
         * StorePlay
         */
        // dispatch(addPlay(play));
        // runNextEffect(play);
      }

      function runPostPlayHook(play: PlayWithId) {
        pipe(
          play,
          foldPlayWithId(
            runNextEffect,
            runNumberCardPlayEffect,
            runBlockCardEffect,
            runDrawCardPlayEffect,
          ),
        );
      }

      runPostPlayHook(play);
      //TODO Run game state reader

      if (isOwnerOfPlay(play, playerId)) {
        // TODO: Update Firebase Session
        console.log('owner');
      }
    },
    [dispatch, currentSession],
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
