import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  getCurrentPlayer,
  getCurrentSessionPlayerValue,
  getLastPlayPosition,
  getNextPlayer,
  getPlayerActions,
  getCurrentCard,
  getSession,
} from '../../../store/session/selectors';
import { getPlayerValue } from '../../../store/playerHand/selector';
import {
  createBlockPlay,
  createCommonNumberPlay,
  createDrawPlay,
  createPassPlay,
} from '../../../model/Play';
import { addPlay } from '../../../store/session/actions';
import { requestRemoveCardFromHand } from '../../../api/db/preGameSession';
import { isBlockCard, isCommonCard } from 'solo-lib/lib/card';
import { buyCard } from '../../../api/functions/card';

export function useTurn() {
  const player = useSelector(getPlayerValue);
  const playerActions = useSelector(getPlayerActions);
  const lastPlayPosition = useSelector(getLastPlayPosition);
  const currentCard = useSelector(getCurrentCard);
  const currentPlayer = useSelector(getCurrentPlayer);
  const nextPlayer = useSelector(getNextPlayer);
  const currentSession = useSelector(getSession);
  const currentSessionPlayer = useSelector(getCurrentSessionPlayerValue);

  const currentSessionPlayerWithId = { ...currentSessionPlayer, id: player.id };

  const [hasDrawed, setHasDrawed] = useState<boolean>(false);

  const isYourTurn = useMemo<boolean>(() => player.id === currentPlayer, [player, currentPlayer]);

  //reset hasDrawed when is your turn
  useEffect(() => {
    isYourTurn && setHasDrawed(false);
  }, [isYourTurn]);

  const dispatch = useDispatch();

  const cardClickGen = useCallback(
    (callback: (card: CardWithId) => Play) => {
      const makeCardPlay = (card: CardWithId) => {
        const play = callback(card);
        return requestRemoveCardFromHand(
          currentSession.id,
          currentSessionPlayerWithId,
          card.id,
        ).then(() => dispatch(addPlay(play))); // add the play
      };

      const handleCardClick = (card: CardWithId) => {
        const isSameCardColor = currentCard.color === card.color;
        const isSameCardValue = currentCard.value === card.value;
        const isSameCard = isSameCardValue && isSameCardColor;
        if (isYourTurn) {
          if (isSameCardValue || isSameCardColor) {
            makeCardPlay(card);
          }
          console.error('invalidCard');
        } else {
          if (isSameCard) {
            makeCardPlay(card);
          } else {
            console.error('not your turn');
          }
        }
      };
      return handleCardClick;
    },
    [currentCard, isYourTurn],
  );

  const handleCommon = cardClickGen(card =>
    createCommonNumberPlay(currentSessionPlayerWithId, card, lastPlayPosition + 1),
  );
  const handleBlock = cardClickGen(card =>
    createBlockPlay(currentSessionPlayerWithId, nextPlayer, card, lastPlayPosition + 1),
  );

  function handleCardClick(card: CardWithId) {
    if (isCommonCard(card)) return handleCommon(card as CommonCardWithId);
    if (isBlockCard(card)) return handleBlock(card);
  }

  async function handleDrawCard() {
    await buyCard(currentSession.id, currentSessionPlayerWithId.id);
    const play = createDrawPlay(currentSessionPlayerWithId, lastPlayPosition + 1);
    dispatch(addPlay(play));
    setHasDrawed(true);
  }

  function handlePass() {
    const play = createPassPlay(currentSessionPlayerWithId, lastPlayPosition + 1);
    dispatch(addPlay(play));
  }

  return { hasDrawed, playerActions, handlePass, handleDrawCard, handleCardClick };
}
