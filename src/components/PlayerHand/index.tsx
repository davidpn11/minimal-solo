import React from 'react';
import { useSelector } from 'react-redux';
import { pipe } from 'fp-ts/lib/pipeable';
import * as R from 'fp-ts/lib/Record';

import { HandWrapper, HandCardsWrapper } from './styles';
import { PlayingCard } from '../PlayingCard';
import { Solo } from '../Solo';
import { Pass } from '../Pass';
import { Card } from '../../model/Card';
import { getPlayer } from '../../store/playerHand/selector';

export function PlayerHand() {
  const player = useSelector(getPlayer);

  function renderCards(): React.ReactNode {
    return pipe(
      player.hand,
      R.reduceWithIndex<string, Card, JSX.Element[]>([], (key, acc, card) => [
        ...acc,
        <PlayingCard
          key={key}
          value={card.value}
          status="HAND"
          color={card.color}
          onClick={() => {}}
        />,
      ]),
    );
  }

  return (
    <HandWrapper>
      <Solo state="CANNOT_SOLO" onClick={() => {}} />
      <HandCardsWrapper>{renderCards()}</HandCardsWrapper>
      <Pass state="CANNOT_PASS" onClick={() => {}} />
    </HandWrapper>
  );
}
