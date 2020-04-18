import React from 'react';
import { CardWrapper, Colors, CardValue, CardUpper, CardLower } from './styles';

type Props = {
  color?: Colors;
  value: string;
};

export default function Card({ color = 'neutral', value }: Props) {
  return (
    <CardWrapper color={color}>
      <CardUpper>{value}</CardUpper>
      <CardValue>{value}</CardValue>
      <CardLower>{value}</CardLower>
    </CardWrapper>
  );
}
