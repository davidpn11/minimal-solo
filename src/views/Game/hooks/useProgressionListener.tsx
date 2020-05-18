import { useState, useEffect } from 'react';
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
  setCurrentPlay,
  setCurrentPlayer,
  setGameProgression,
} from '../../../store/session/actions';
import { isPass, Play, PlayWithId } from '../../../model/Play';
import { noop } from '../../../utils/unit';
import { isOwnerOfPlay, getNextPlayer } from '../helpers/plays';
import { getPlayerValue } from '../../../store/playerHand/selector';

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

  function runPostPlayHook(play: PlayWithId) {
    if (isPass(play)) return runNextEffect(play);
  }

  function handleLastPlay(play: PlayWithId, playerId: string) {
    runPostPlayHook(play);

    if (isOwnerOfPlay(play, playerId)) {
      console.log('owner');
    }
  }

  useEffect(() => {
    if (currentSession.id && !hasListener && currentSession.status === 'STARTED') {
      setHasListener(true);
      // const totalPlays = Object.keys(currentSession.progression).length;

      requestProgressionListener(currentSession.id, progression => {
        dispatch(setGameProgression(progression));
      });
    }
  }, [currentSession.id, hasListener, dispatch]);

  useEffect(() => {
    return pipe(
      A.last(orderedProgression),
      O.fold(noop, play => {
        if (currentPlay !== play.id) {
          handleLastPlay(play, player.id);
        }
      }),
    );
  }, [orderedProgression]);

  return {
    isCurrentPlayer: currentPlayer === player.id,
  };
}
