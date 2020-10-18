import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  getCurrentCardValue,
  getCurrentPlayer,
  getCurrentSessionPlayerValue,
  getLastPlayPosition,
  getNextPlayer,
  getPlayerActions,
  getSessionValue,
} from '../../../store/session/selectors';
import { getPlayerHandIds, getPlayerValue } from '../../../store/playerHand/selector';
import { getPlayerHand } from '../../../store/playerHand/actions';
import { requestPlayerHandListener } from '../../../api/db/gameSession';
import {
  createBlockPlay,
  createCommonNumberPlay,
  createDrawPlay,
  createPassPlay,
} from '../../../model/Play';
import { addPlay } from '../../../store/session/actions';
import {
  buyCard,
  isBlockCard, isCommonCard,
} from '../../../model/Card';
import { requestRemoveCardFromHand } from '../../../api/db/preGameSession';

export function useHandListener() {
  const player = useSelector(getPlayerValue);
  const playerHand = useSelector(getPlayerHandIds);
  const playerActions = useSelector(getPlayerActions);
  const lastPlayPosition = useSelector(getLastPlayPosition);
  const currentCard = useSelector(getCurrentCardValue);
  const currentPlayer = useSelector(getCurrentPlayer);
  const nextPlayer = useSelector(getNextPlayer);
  const currentSession = useSelector(getSessionValue);
  const currentSessionPlayer = useSelector(getCurrentSessionPlayerValue);
  const currentSessionPlayerWithId = { ...currentSessionPlayer, id: player.id };
  const isYourTurn = useMemo<boolean>(() => player.id === currentPlayer, [player, currentPlayer]);
  const [hasListener, setHasListener] = useState<boolean>(false);
  const [hasDrawed, setHasDrawed] = useState<boolean>(false);

  //reset hasDrawed when is your turn
  useEffect(() => {
    isYourTurn && setHasDrawed(false);
  }, [isYourTurn]);

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

  function handleBlockCard(card: ActionCardWithId) {
    const isSameCardColor = currentCard.color === card.color;
    const isSameCardValue = currentCard.value === card.value;
    const isSameCard = isSameCardValue && isSameCardColor;

    if (isSameCard) {
      // play the card
      const play = createBlockPlay(
        currentSessionPlayerWithId,
        nextPlayer,
        card,
        lastPlayPosition + 1,
      );
      // delete it from hand
      return requestRemoveCardFromHand(
        currentSession.id,
        currentSessionPlayerWithId,
        card.id,
      ).then(() => dispatch(addPlay(play))); // add the play
    } else if (isYourTurn) {
      if (isSameCardColor || isSameCardValue) {
        // play the card
        const play = createBlockPlay(
          currentSessionPlayerWithId,
          nextPlayer,
          card,
          lastPlayPosition + 1,
        );
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
    if (isCommonCard(card)) return handleCommonNumberCard(card as CommonCardWithId);
    if (isBlockCard(card)) return handleBlockCard(card);
  }

  async function handleDrawCard() {
    const card = await buyCard(currentSession.id, currentSessionPlayerWithId.id);
    const play = createDrawPlay(currentSessionPlayerWithId, lastPlayPosition + 1);
    dispatch(addPlay(play));
    setHasDrawed(true);
  }

  function handlePass() {
    const play = createPassPlay(currentSessionPlayerWithId, lastPlayPosition + 1);
    dispatch(addPlay(play));
  }

  //Player hand listener
  useEffect(() => {
    if (currentSession.id && !hasListener) {
      setHasListener(true);
      if (player) {
        requestPlayerHandListener(player.id, currentSession.id, hand => {
          dispatch(getPlayerHand(currentSession.id, hand));
        });
      }
    }
  }, [currentSession.id, hasListener, player, dispatch]);

  return { playerHand, playerActions, hasDrawed, handlePass, handleDrawCard, handleCardClick };
}

// Pre        ---   Game   --   Post
// canPlayType |            |   play types
// canPlayFold |            |   play fold
// useHandListener |        |   useProgressionListener
