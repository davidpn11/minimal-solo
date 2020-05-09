import React from 'react';
import { PlayingCard } from '../../../../components/PlayingCard';
import { CardsWrapper } from './styles';

const cards = Array(30).fill({
  id: '1',
  status: 'GAME',
  color: 'RED',
  value: 'ONE',
});

export default function CardDeck() {
  return (
    <CardsWrapper>
      {cards.map(card => (
        <PlayingCard key={card.id} color={card.color} status="DECK" value={card.value} />
      ))}
    </CardsWrapper>
  );
}
