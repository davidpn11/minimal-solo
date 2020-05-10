import React from 'react';

import { CardWrapper, CardValue, CardUpper, CardLower } from './styles';
import { mapIcons } from './helpers';
import { Color, CardStatus, Value } from '../../model/Card';

export type Props = {
  color: Color;
  value: Value;
  status: CardStatus;
  onClick?: (e: React.MouseEvent) => void;
};

export function PlayingCard(props: Props) {
  const { main, corner } = mapIcons(props);

  return (
    <CardWrapper onClick={props.onClick} status={props.status} color={props.color}>
      <CardUpper>{corner}</CardUpper>
      <CardValue>{main}</CardValue>
      <CardLower>{corner}</CardLower>
    </CardWrapper>
  );
}
