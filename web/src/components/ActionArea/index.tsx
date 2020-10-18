import React from 'react';
import { useSelector } from 'react-redux';

import { AreaWrapper, LogoWrapper, SectionWrapper } from './styles';
import { Logo } from '../Logo';
import { CardDeck } from '../CardDeck';
import { PlayingCard } from '../PlayingCard';
import { isCurrentPlayerSelector } from '../../store/playerHand/selector';

type Props = {
  currentCard: Card;
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
        <PlayingCard
          aria-label={`Current Card: ${props.currentCard.color} ${props.currentCard.value}`}
          value={props.currentCard.value}
          color={props.currentCard.color}
          status="PLAY"
        />
      </SectionWrapper>
      <SectionWrapper aria-label="Card Deck" onClick={onClick}>
        <CardDeck />
      </SectionWrapper>
    </AreaWrapper>
  );
}
