import React from 'react';
import { useSelector } from 'react-redux';
import { isCurrentPlayerSelector } from '../../store/playerHand/selector';
import { PlayingCard } from '../PlayingCard';
import { CardsWrapper } from './styles';

const CARDS = Array(30).fill({
  id: '1',
  status: 'GAME',
  color: 'RED',
  value: 'ONE',
});

export function CardDeck() {
  const isCurrentPlayer = useSelector(isCurrentPlayerSelector);
  return (
    <CardsWrapper isCurrentPlayer={isCurrentPlayer}>
      {CARDS.map((card, index) => (
        <PlayingCard key={index} color={card.color} status="DECK" value={card.value} />
      ))}
    </CardsWrapper>
  );
}
