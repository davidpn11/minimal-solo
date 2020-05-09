import React from "react";
import {
  PlayerWrapper,
  PlayerName,
  PlayerCardsCount,
  PlayerDeck,
} from "./style";
import { SessionPlayer } from "../../../../model/Player";
import { PlayingCard } from "../../../../components/PlayingCard";

type Props = {
  playerPosition: number;
  player: SessionPlayer;
};

export default function TablePlayer(props: Props) {
  return (
    <PlayerWrapper
      style={{
        gridArea: `player-${props.playerPosition}`,
      }}
    >
      <PlayerName>{props.player.name}</PlayerName>
      <PlayerCardsCount>{props.player.hand.length} cards</PlayerCardsCount>
      <PlayerDeck>
        {props.player.hand.map((card) => (
          <PlayingCard status="DECK" color="BLACK" value="ONE" />
        ))}
      </PlayerDeck>
    </PlayerWrapper>
  );
}
