import React from "react";
import { DeckWrapper } from "./styles";
import { PlayingCard } from "../../../../components/PlayingCard";

export default function MyDeck() {
  return (
    <DeckWrapper>
      <PlayingCard value="ONE" color="RED" status={"DECK"} />
      <PlayingCard value="ONE" color="RED" status={"DECK"} />
      <PlayingCard value="ONE" color="RED" status={"DECK"} />
      <PlayingCard value="ONE" color="RED" status={"DECK"} />
      <PlayingCard value="ONE" color="RED" status={"DECK"} />
      <PlayingCard value="ONE" color="RED" status={"DECK"} />
      <PlayingCard value="ONE" color="GOLD" status={"DECK"} />
      <PlayingCard value="ONE" color="RED" status={"DECK"} />
      <PlayingCard value="ONE" color="RED" status={"DECK"} />
      <PlayingCard value="ONE" color="RED" status={"DECK"} />
      <PlayingCard value="ONE" color="RED" status={"DECK"} />
      <PlayingCard value="ONE" color="RED" status={"DECK"} />
      <PlayingCard value="ONE" color="RED" status={"DECK"} />
      <PlayingCard value="ONE" color="RED" status={"DECK"} />
      <PlayingCard value="ONE" color="RED" status={"DECK"} />
      <PlayingCard value="ONE" color="RED" status={"DECK"} />
    </DeckWrapper>
  );
}
