import React from "react";
import { useSelector } from "react-redux";
import { pipe } from "fp-ts/lib/pipeable";
import * as O from "fp-ts/lib/Option";

import { ActionWrapper, Code, Page, Title, LobbyWrapper } from "./styles";

import { Button } from "../../components/Button";
import {
  allPlayersReady,
  getSession,
  getCurrentSessionPlayer,
} from "../../store/session/selectors";
import {
  isCurrentPlayerAdmin,
  getPlayerId,
} from "../../store/playerHand/selector";
import { LocalSessionWithId } from "../../model/Session";
import { useMatchMaker } from "../../hooks/useMatchMaker";
import { usePlayersGrid } from "../../hooks/usePlayersGrid";
import { SessionPlayer } from "../../model/Player";

const SESSION: LocalSessionWithId = {
  id: "ACeKB3PFRXkvv6QdyCHw",
  code: "42886",
  status: "INITIAL",
  players: {
    "2": { status: "READY", hand: [], name: "John" },
    "3": { status: "READY", hand: [], name: "Kevin" },
    "4": { status: "READY", hand: [], name: "Max" },
    "6": { status: "READY", hand: [], name: "Rob" },
    "7": { status: "READY", hand: [], name: "Alex" },
    "2zqR87wtl8zrzXwW43HH": { status: "READY", hand: [], name: "Jamie" },
    "8": { status: "READY", hand: [], name: "Bruce" },
    "30gHNPYwsVUOQOW2ovDr": { hand: [], status: "ADMIN", name: "David" },
    DQ9QotLCW2AwX9jfcMHy: { hand: [], status: "READY", name: "Pedro" },
  },
  admin: "30gHNPYwsVUOQOW2ovDr",
};

const PLAYER = O.some({
  name: "David",
  hand: [],
  status: "ADMIN",
} as SessionPlayer);

export default function Lobby() {
  // const currentSession = SESSION;
  // const currentPlayerId = "2zqR87wtl8zrzXwW43HH";
  // const currentSessionPlayer = PLAYER;
  // const isAllPlayersReady = true;
  const isAllPlayersReady = useSelector(allPlayersReady);
  const currentSession = useSelector(getSession);
  const currentPlayerId = useSelector(getPlayerId);
  const currentSessionPlayer = useSelector(getCurrentSessionPlayer);
  const isAdmin = useSelector(isCurrentPlayerAdmin);
  const playersGrid = usePlayersGrid();

  const { toggleStatus, startGame } = useMatchMaker();

  return pipe(
    currentSessionPlayer,
    O.fold(
      () => <div />,
      (player) => (
        <Page>
          <LobbyWrapper>
            <Title>Room Code</Title>
            <Code>{currentSession.code}</Code>
            <Title>Players</Title>
            {playersGrid}
            <ActionWrapper>
              {isAdmin ? (
                <Button onClick={startGame} disabled={!isAllPlayersReady}>
                  Start Game
                </Button>
              ) : (
                <Button
                  variant={player.status === "READY" ? "secondary" : "primary"}
                  onClick={toggleStatus(currentPlayerId, player.status)}
                >
                  {player.status === "READY" ? "Ready" : "Not Ready"}
                </Button>
              )}
            </ActionWrapper>
          </LobbyWrapper>
        </Page>
      )
    )
  );
}
