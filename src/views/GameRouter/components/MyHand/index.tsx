import React from 'react';
import { DeckWrapper, HandCardsWrapper, HandCardWrapper } from './styles';
import { PlayingCard } from '../../../../components/PlayingCard';
import { useSelector } from 'react-redux';
import { getPlayer } from '../../../../store/playerHand/selector';
import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';
import * as R from 'fp-ts/lib/Record';
import { Card } from '../../../../model/Card';

export default function MyDeck() {
  const player = useSelector(getPlayer);

  const renderCards = () =>
    pipe(
      player.hand,
      R.reduceWithIndex([] as JSX.Element[], (key, acc, card) => [
        ...acc,
        <PlayingCard key={key} value={card.value} status="HAND" color={card.color} />,
      ]),
    );
  return (
    <DeckWrapper>
      <HandCardsWrapper>{renderCards()}</HandCardsWrapper>
    </DeckWrapper>
  );
}
