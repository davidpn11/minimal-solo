import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  getCurrentCardValue,
  getCurrentPlayer,
  getCurrentSessionPlayerValue,
  getLastPlayPosition,
  getPlayerActions,
  getSessionValue,
} from '../../../store/session/selectors';
import { getPlayerHandIds, getPlayerValue } from '../../../store/playerHand/selector';
import { getPlayerHand } from '../../../store/playerHand/actions';
import { requestPlayerHandListener } from '../../../api/db/gameSession';
import { createCommonNumberPlay, createPassPlay } from '../../../model/Play';
import { addPlay } from '../../../store/session/actions';
import { CardWithId, CommonCardWithId, isCommonNumberCard } from '../../../model/Card';
import { requestRemoveCardFromHand } from '../../../api/db/preGameSession';

// const ArrayEq = A.getEq(eqString);

export function useHandListener() {
  const player = useSelector(getPlayerValue);
  const playerHand = useSelector(getPlayerHandIds);
  const playerActions = useSelector(getPlayerActions);
  const lastPlayPosition = useSelector(getLastPlayPosition);
  const currentCard = useSelector(getCurrentCardValue);
  const currentPlayer = useSelector(getCurrentPlayer);
  const currentSession = useSelector(getSessionValue);
  const currentSessionPlayer = useSelector(getCurrentSessionPlayerValue);
  const currentSessionPlayerWithId = { ...currentSessionPlayer, id: player.id };
  const isYourTurn = useMemo<boolean>(() => player.id === currentPlayer, [player, currentPlayer]);
  const [hasListener, setHasListener] = useState<boolean>(false);
  // const [currPlayerHand, setCurrPlayerHand] = useState<string[]>([]);
  const dispatch = useDispatch();

  function handleCommonNumberCard(card: CommonCardWithId) {
    const isSameCardColor = currentCard.color === card.color;
    const isSameCardValue = currentCard.value === card.value;
    const isSameCard = isSameCardValue && isSameCardColor;

    if (isSameCard) {
      // play the card
      const play = createCommonNumberPlay(currentSessionPlayerWithId, card, lastPlayPosition + 1);
      // delete it from hand
      return requestRemoveCardFromHand(
        currentSession.id,
        currentSessionPlayerWithId,
        card.id,
      ).then(() => dispatch(addPlay(play))); // add the play
    } else if (isYourTurn) {
      if (isSameCardColor || isSameCardValue) {
        // play the card
        const play = createCommonNumberPlay(currentSessionPlayerWithId, card, lastPlayPosition + 1);
        // delete it from hand
        return requestRemoveCardFromHand(
          currentSession.id,
          currentSessionPlayerWithId,
          card.id,
        ).then(() => dispatch(addPlay(play))); // add the play
      }
      // Show message cannot play this card
      return;
    } else {
      // show message is not your turn
      return;
    }
  }

  function handleCardClick(card: CardWithId) {
    if (isCommonNumberCard(card)) return handleCommonNumberCard(card as CommonCardWithId);
  }

  function handlePass() {
    const play = createPassPlay(currentSessionPlayerWithId, lastPlayPosition + 1);
    dispatch(addPlay(play));
  }

  // useEffect(() => {
  //   if (!ArrayEq.equals(currPlayerHand, playerHand)) {
  //     setCurrPlayerHand(playerHand);
  //     dispatch(getPlayerHand(currentSession.id, playerHand));
  //   }
  // }, [playerHand, dispatch, currentSession.id]);

  //Player hand listener
  useEffect(() => {
    if (currentSession.id && !hasListener) {
      setHasListener(true);
      if (player) {
        requestPlayerHandListener(player.id, currentSession.id, hand => {
          console.log({ handFromListener: hand });
          dispatch(getPlayerHand(currentSession.id, hand));
        });
      }
    }
  }, [currentSession.id, hasListener, dispatch]);

  return { playerHand, playerActions, handlePass, handleCardClick };
}
