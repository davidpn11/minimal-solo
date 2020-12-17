import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch, batch } from 'react-redux';
import { pipe } from 'fp-ts/lib/pipeable';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { normalizeQuery } from '@mikelfcosta/solo-lib/lib/utils/firebase';

import {
  getCurrentPlay,
  getCurrentPlayer,
  getOrderedProgression,
  getStartedSession,
} from '../../../store/session/selectors';
import {
  setCurrentCard,
  setCurrentPlay,
  setCurrentPlayer,
  setGameProgression,
} from '../../../store/session/actions';
import { noop } from '../../../utils/unit';
import { isOwnerOfPlay, getNextPlayerByPlay } from '../helpers/plays';
import { getPlayerValue } from '../../../store/playerHand/selector';
import { foldPlayWithId } from '../../../store/playerHand/helpers/foldPlay';
import { getSessionRef } from '../../../api/firebase';
import { buyCard } from '../../../api/functions/card';

export function useProgressionListener() {
  const player = useSelector(getPlayerValue);
  const currentSession = useSelector(getStartedSession);
  const currentPlay = useSelector(getCurrentPlay);
  const currentPlayer = useSelector(getCurrentPlayer);
  const orderedProgression = useSelector(getOrderedProgression);
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

      function runPlusTwoCardPlayEffect(play: PlusTwoPlay & ID) {
        if (play.player.id === player.id) {
          // runNextEffect(play);
        } else if (play.target.id === player.id) {
          // await buyCard(currentSession.id, player.id);
          // await buyCard(currentSession.id, player.id);
          console.log('TARGET PLAYER', play);
        }
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
            runPlusTwoCardPlayEffect,
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
    const unsubscribe = getSessionRef(currentSession.id)
      .collection('progression')
      .onSnapshot(querySnapshot => {
        const progression = normalizeQuery<Play>(querySnapshot);
        dispatch(setGameProgression(progression));
      });
    return () => {
      unsubscribe();
    };
  }, [currentSession.id, dispatch]);

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
