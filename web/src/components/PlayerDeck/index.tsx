import React from 'react';
import { PlayerDeckWrapper, PlayerName, PlayerCardsCount, PlayerDeckPile } from './style';
import { SessionPlayer } from '../../model/Player';
import { PlayingCard } from '../PlayingCard';
import { mapCountToColor, mapCountToGradient } from './helpers';

type Props = {
  playerPosition: number;
  player: SessionPlayer;
};

export function PlayerDeck(props: Props) {
  const cardCount = props.player.hand.length;

  return (
    <PlayerDeckWrapper
      position={props.playerPosition}
      textColor={mapCountToColor(cardCount)}
      gradientColor={mapCountToGradient(cardCount)}
    >
      <PlayerName>{props.player.name}</PlayerName>
      <PlayerCardsCount>{cardCount} cards</PlayerCardsCount>
      <PlayerDeckPile>
        {props.player.hand.map(card => (
          <PlayingCard key={card} status="DECK" color="BLACK" value="ONE" />
        ))}
      </PlayerDeckPile>
    </PlayerDeckWrapper>
  );
}
