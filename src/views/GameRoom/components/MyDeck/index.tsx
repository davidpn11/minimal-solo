import React from 'react';
import { DeckWrapper } from './styles';
import {PlayingCard} from '../../../../components/PlayingCard';

export default function MyDeck() {
  return <DeckWrapper>
      <PlayingCard value="ONE" status="HAND" color="RED" />
      <PlayingCard value="ONE" status="HAND" color="RED" />
      <PlayingCard value="ONE" status="HAND" color="RED" />
      <PlayingCard value="ONE" status="HAND" color="RED" />
      <PlayingCard value="ONE" status="HAND" color="RED" />
      <PlayingCard value="ONE" status="HAND" color="RED" />
      <PlayingCard value="ONE" status="HAND" color="RED" />
      <PlayingCard value="ONE" status="HAND" color="RED" />
      <PlayingCard value="ONE" status="HAND" color="RED" />
      <PlayingCard value="ONE" status="HAND" color="RED" />
      <PlayingCard value="ONE" status="HAND" color="RED" />
      <PlayingCard value="ONE" status="HAND" color="RED" />
      <PlayingCard value="ONE" status="HAND" color="RED" />
      <PlayingCard value="ONE" status="HAND" color="RED" />
      <PlayingCard value="ONE" status="HAND" color="RED" />
      <PlayingCard value="ONE" status="HAND" color="RED" />
  </DeckWrapper>;
}
