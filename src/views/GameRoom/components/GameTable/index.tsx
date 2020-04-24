import React from "react";
import { TableWrapper } from "./styles";
import { PlayingCard } from "../../../../components/PlayingCard";

export default function GameTable() {
  return (
    <TableWrapper>
      <PlayingCard value="ONE" color="RED" status={"DECK"} />
      <PlayingCard value="ONE" color="RED" status={"DECK"} />
      <PlayingCard value="ONE" color="RED" status={"DECK"} />
      <PlayingCard value="ONE" color="RED" status={"DECK"} />
    </TableWrapper>
  );
}
