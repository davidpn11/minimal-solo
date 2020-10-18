import React from 'react';

import { CardWrapper, CardValueElement, CardUpper, CardLower } from './styles';
import { mapIcons } from './helpers';

export type Props = {
  color: CardColor;
  value: CardValue;
  status: CardStatus;
  onClick?: (e: React.MouseEvent) => void;
};

export function PlayingCard(props: Props) {
  const { main, corner } = mapIcons(props);

  return (
    <CardWrapper onClick={props.onClick} status={props.status} color={props.color}>
      <CardUpper>{corner}</CardUpper>
      <CardValueElement>{main}</CardValueElement>
      <CardLower>{corner}</CardLower>
    </CardWrapper>
  );
}
