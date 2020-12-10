import React from 'react';
import { useSelector } from 'react-redux';

import { BoardWrapper, GameWrapper, Main } from './styles';
import GameTable from './components/GameTable';
import { PlayerHand } from '../../components/PlayerHand';
import { Side } from '../../components/Side';
import { useHandListener } from './hooks/useHandListener';
import { useProgressionListener } from './hooks/useProgressionListener';
import { getPlayerValue } from '../../store/playerHand/selector';
import { getCurrentCard, getOrderedPlayers } from '../../store/session/selectors';
import { useTurn } from './hooks/useTurn';
import { usePlayersListener } from './hooks/usePlayersListener';

export function Game() {
  const players = useSelector(getOrderedPlayers);
  const currentCard = useSelector(getCurrentCard);
  const player = useSelector(getPlayerValue);
  const { playerActions } = useHandListener();
  const { hasDrawed, handlePass, handleDrawCard, handleCardClick } = useTurn();
  const { isCurrentPlayer } = useProgressionListener();
  usePlayersListener();

  const onDeckClick = () => {
    if (!hasDrawed) handleDrawCard();
  };

  return (
    <GameWrapper>
      <Main>
        <BoardWrapper>
          <GameTable
            onDeckClick={onDeckClick}
            players={players}
            currentCard={currentCard}
            isActive={isCurrentPlayer}
          />
        </BoardWrapper>
        <PlayerHand
          onPass={handlePass}
          pass={playerActions.passAction}
          onSolo={() => {}}
          solo={playerActions.soloAction}
          cards={player.hand}
          onCardClick={handleCardClick}
        />
      </Main>
      <Side />
    </GameWrapper>
  );
}
