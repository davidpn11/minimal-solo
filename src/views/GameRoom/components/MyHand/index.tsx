import React from 'react';
import { DeckWrapper, HandCardsWrapper, HandCardWrapper } from './styles';
import { PlayingCard } from '../../../../components/PlayingCard';

const cards = Array(15).fill({
  id: '1',
  status: 'GAME',
  color: 'RED',
  value: 'ONE',
});

export default function MyDeck() {
  return (
    <DeckWrapper>
      <HandCardsWrapper>
        {cards.map((card) => (
          <HandCardWrapper>
            <PlayingCard value={card.value} status="HAND" color={card.color} />
          </HandCardWrapper>
        ))}
      </HandCardsWrapper>
    </DeckWrapper>
  );
}
