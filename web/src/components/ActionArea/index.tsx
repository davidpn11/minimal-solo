import React from 'react';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

import { AreaWrapper, LogoWrapper, SectionWrapper } from './styles';
import { Logo } from '../Logo';
import { CardDeck } from '../CardDeck';
import { Card } from '../../model/Card';
import { PlayingCard } from '../PlayingCard';
import { unitJSX } from '../../utils/unit';
import { useSelector } from 'react-redux';
import { isCurrentPlayerSelector } from '../../store/playerHand/selector';

type Props = {
  currentCard: O.Option<Card>;
  onDeckClick: () => void;
};

export function ActionArea(props: Props) {
  const isCurrentPlayer = useSelector(isCurrentPlayerSelector);

  const onClick = () => isCurrentPlayer && props.onDeckClick();
  return (
    <AreaWrapper>
      <LogoWrapper>
        <Logo variant="WHITE" />
      </LogoWrapper>
      <SectionWrapper>
        {pipe(
          props.currentCard,
          O.fold(
            () => unitJSX,
            card => (
              <PlayingCard
                aria-label={`Current Card: ${card.color} ${card.value}`}
                value={card.value}
                color={card.color}
                status="PLAY"
              />
            ),
          ),
        )}
      </SectionWrapper>
      <SectionWrapper aria-label="Card Deck" onClick={onClick}>
        <CardDeck />
      </SectionWrapper>
    </AreaWrapper>
  );
}
