import React from 'react';
import { useSelector } from 'react-redux';

import { TableWrapper } from './styles';
import { PlayerDeck } from '../../../../components/PlayerDeck';
import { getCurrentCard, getAllPlayers } from '../../../../store/session/selectors';
import { ActionArea } from '../../../../components/ActionArea';

export default function GameTable() {
  const players = useSelector(getAllPlayers);
  const currentCard = useSelector(getCurrentCard);

  return (
    <TableWrapper>
      <ActionArea
        currentCard={currentCard}
        onDeckClick={() => console.log('Deck')}
        onCurrentClick={() => console.log('Current')}
      />
      {Object.values(players).map((player, index) => (
        <PlayerDeck key={`${player.name}-player-${index}`} player={player} playerPosition={index} />
      ))}
    </TableWrapper>
  );
}
