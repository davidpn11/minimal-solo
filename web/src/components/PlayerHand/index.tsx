import React, { useRef, useEffect } from 'react';
import { pipe } from 'fp-ts/lib/pipeable';
import * as R from 'fp-ts/lib/Record';

import { HandWrapper, HandCardsWrapper } from './styles';
import { PlayingCard } from '../PlayingCard';
import { Solo } from '../Solo';
import { SoloButtonStates } from '../Solo/styles';
import { Pass, PassButtonStates } from '../Pass';

type Props = {
  solo: SoloButtonStates;
  onSolo: () => void;
  pass: PassButtonStates;
  onPass: () => void;
  cards: Normalized<Card>;
  onCardClick: (card: CardWithId) => void;
};

export function PlayerHand(props: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollLeft = wrapperRef.current.scrollWidth;
    }
  }, [props.cards]);

  function renderCards(): React.ReactNode {
    return pipe(
      props.cards,
      R.reduceWithIndex<string, Card, JSX.Element[]>([], (id, acc, card) => [
        ...acc,
        <PlayingCard
          key={id}
          aria-label={`Playing Card on Hand: ${card.color} ${card.value}`}
          value={card.value}
          status="HAND"
          color={card.color}
          onClick={() => props.onCardClick({ id, ...card })}
        />,
      ]),
    );
  }

  return (
    <HandWrapper>
      <Solo state={props.solo} onClick={props.onSolo} />
      <HandCardsWrapper ref={wrapperRef}>{renderCards()}</HandCardsWrapper>
      <Pass state={props.pass} onClick={props.onPass} />
    </HandWrapper>
  );
}
