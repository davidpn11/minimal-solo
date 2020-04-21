import React from 'react';
import { CardWrapper, CardValue, CardUpper, CardLower } from './styles';
import {Card} from "../../model/Card";

type Props = Card;

export function PlayingCard(props: Props) {
  return (
    <CardWrapper color={props.color}>
      <CardUpper>1</CardUpper>
      <CardValue>1</CardValue>
      <CardLower>1</CardLower>
    </CardWrapper>
  );
}
