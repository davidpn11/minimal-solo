import React from 'react';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

import { AreaWrapper, LogoWrapper, SectionWrapper } from './styles';
import { Logo } from '../Logo';
import CardDeck from '../CardDeck';
import { Card } from '../../model/Card';
import { PlayingCard } from '../PlayingCard';
import { unitJSX } from '../../utils/unit';

type Props = {
  currentCard: O.Option<Card>;
};

export function ActionArea(props: Props) {
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
            card => <PlayingCard value={card.value} color={card.color} status="PLAY" />,
          ),
        )}
      </SectionWrapper>
      <SectionWrapper>
        <CardDeck />
      </SectionWrapper>
    </AreaWrapper>
  );
}
