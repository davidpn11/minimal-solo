import React from 'react';
import { PlayingCard } from '../../../../components/PlayingCard';
import { useSelector } from 'react-redux';
import { getCurrentCard } from '../../../../store/session/selectors';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

export default function CurrentCard() {
  const currentCard = useSelector(getCurrentCard);

  return pipe(
    currentCard,
    O.fold(
      () => null,
      card => <PlayingCard value={card.value} color={card.color} status="PLAY" />,
    ),
  );
}
