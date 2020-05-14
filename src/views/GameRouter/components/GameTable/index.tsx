import React from 'react';
import { useSelector } from 'react-redux';

import { TableWrapper } from './styles';
import { PlayerDeck } from '../../../../components/PlayerDeck';
import { ActionArea } from '../../../../components/ActionArea';
import { getCurrentCard, getOrderedPlayers } from '../../../../store/session/selectors';

export default function GameTable() {
  const players = useSelector(getOrderedPlayers);
  const currentCard = useSelector(getCurrentCard);

  return (
    <TableWrapper>
      <ActionArea
        currentCard={currentCard}
        onDeckClick={() => console.log('Deck')}
        onCurrentClick={() => console.log('Current')}
      />
      {players.map((player, index) => (
        <PlayerDeck key={`${player.id}-player-${index}`} player={player} playerPosition={index} />
      ))}
    </TableWrapper>
  );
}
