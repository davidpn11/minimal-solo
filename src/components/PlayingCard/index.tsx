import React from 'react';

import { CardWrapper, CardValue, CardUpper, CardLower } from './styles';
import { mapIcons } from './helpers';
import { Color, CardStatus, Value } from '../../model/Card';

export type Props = {
  color: Color;
  value: Value;
  status: CardStatus;
};

export function PlayingCard(props: Props) {
  const { main, corner } = mapIcons(props);

  return (
    <CardWrapper status={props.status} color={props.color}>
      <CardUpper>{corner}</CardUpper>
      <CardValue>{main}</CardValue>
      <CardLower>{corner}</CardLower>
    </CardWrapper>
  );
}
