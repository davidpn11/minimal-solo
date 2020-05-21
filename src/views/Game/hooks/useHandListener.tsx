import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as A from 'fp-ts/lib/Array';
import { eqString } from 'fp-ts/lib/Eq';

import {
  getCurrentCard,
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
import { Card, CommonCard, isCommonNumberCard } from '../../../model/Card';

const ArrayEq = A.getEq(eqString);

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
  const [currPlayerHand, setCurrPlayerHand] = useState<string[]>([]);
  const dispatch = useDispatch();

  function handleCommonNumberCard(card: CommonCard) {
    const isSameCardColor = currentCard.color === card.color;
    const isSameCardValue = currentCard.value === card.value;
    const isSameCard = isSameCardValue && isSameCardColor;

    if (isSameCard) {
      // play the card
      return;
    } else if (isYourTurn) {
      if (isSameCardColor || isSameCardValue) {
        // play the card
        const play = createCommonNumberPlay(currentSessionPlayerWithId, card, lastPlayPosition + 1);
        dispatch(addPlay(play));
        return;
      }
      // Show message cannot play this card
      return;
    } else {
      // show message is not your turn
      return;
    }
  }

  function handleCardClick(card: Card) {
    if (isCommonNumberCard(card)) return handleCommonNumberCard(card as CommonCard);
  }

  function handlePass() {
    const play = createPassPlay(currentSessionPlayerWithId, lastPlayPosition + 1);
    dispatch(addPlay(play));
  }

  useEffect(() => {
    if (!ArrayEq.equals(currPlayerHand, playerHand)) {
      setCurrPlayerHand(playerHand);
      dispatch(getPlayerHand(currentSession.id, playerHand));
    }
  }, [playerHand, dispatch, currentSession.id]);

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

  return { playerHand, playerActions, handlePass, handleCardClick };
}
