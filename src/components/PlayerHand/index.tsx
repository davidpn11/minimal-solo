import React from 'react';
import { useSelector } from 'react-redux';
import { pipe } from 'fp-ts/lib/pipeable';
import * as R from 'fp-ts/lib/Record';

import { DeckWrapper, HandCardsWrapper } from './styles';
import { PlayingCard } from '../PlayingCard';
import { Card } from '../../model/Card';
import { getPlayer } from '../../store/playerHand/selector';

export function PlayerHand() {
  const player = useSelector(getPlayer);

  function renderCards(): React.ReactNode {
    return pipe(
      player.hand,
      R.reduceWithIndex<string, Card, JSX.Element[]>([], (key, acc, card) => [
        ...acc,
        <PlayingCard key={key} value={card.value} status="HAND" color={card.color} />,
      ]),
    );
  }

  return (
    <DeckWrapper>
      <HandCardsWrapper>{renderCards()}</HandCardsWrapper>
    </DeckWrapper>
  );
}
