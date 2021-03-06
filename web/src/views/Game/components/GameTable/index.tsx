import React from 'react';

import { TableWrapper } from './styles';
import { PlayerDeck } from '../../../../components/PlayerDeck';
import { ActionArea } from '../../../../components/ActionArea';

type Props = {
  players: SessionPlayerWithId[];
  currentCard: Card;
  isActive: boolean;
  onDeckClick: () => void;
};

export default function GameTable(props: Props) {
  return (
    <TableWrapper>
      <ActionArea currentCard={props.currentCard} onDeckClick={props.onDeckClick} />
      {props.players.map((player, index) => (
        <PlayerDeck key={`${player.id}-player-${index}`} player={player} playerPosition={index} />
      ))}
    </TableWrapper>
  );
}
