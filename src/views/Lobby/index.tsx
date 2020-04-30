import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { pipe } from "fp-ts/lib/pipeable";
import * as O from "fp-ts/lib/Option";
import * as R from "fp-ts/lib/Record";

import {
  ActionWrapper,
  Code,
  Page,
  PlayersWrapper,
  Title,
  AdminPlayer,
  CurrentPlayer,
} from "./styles";
import {
  requestSessionPlayersListener,
  requestTogglePlayerStatus,
} from "../../api/db/session";
import { Button } from "../../components/Button";
import { LobbyPlayerCard } from "../../components/LobbyPlayerCard";
import { PlayerStatus, SessionPlayer } from "../../model/Player";
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
    DQ9QotLCW2AwX9jfcMHy: { hand: [], status: "NOT_READY", name: "Pedro" },
  },
  admin: "30gHNPYwsVUOQOW2ovDr",
};

const PLAYER = O.some({
  name: "David",
  hand: [],
  status: "ADMIN",
} as SessionPlayer);

export default function Lobby() {
  const currentSession = SESSION;
  const currentPlayerId = "2zqR87wtl8zrzXwW43HH";
  const currentSessionPlayer = PLAYER;
  // const currentSession = useSelector(getSession);
  // const currentPlayerId = useSelector(getPlayerId);
  // const currentSessionPlayer = useSelector(getCurrentSessionPlayer);
  const isAdmin = useSelector(isCurrentPlayerAdmin);
  const isAllPlayersReady = useSelector(allPlayersReady);

  const toggleStatus = (
    playerId: string,
    playerStatus: PlayerStatus
  ) => async () => {
    await requestTogglePlayerStatus(currentSession.id, playerId, playerStatus);
  };

  const startGame = () => {
    console.log("start");
  };

  const getPlayersGrid = () => {
    const isCurrentPlayer = (id: string) => currentPlayerId === id;
    const isAdminPlayer = (player: SessionPlayer) => player.status === "ADMIN";

    const filterCurrentPlayer = (key: string) => isCurrentPlayer(key);
    const filterAdminPlayer = (key: string, value: SessionPlayer) =>
      isAdminPlayer(value);

    const filterCommonPlayers = (key: string, value: SessionPlayer) => {
      if (isCurrentPlayer(key) || isAdminPlayer(value)) return O.none;
      return O.fromNullable(value);
    };

    const renderPlayerArea = (
      key: string,
      acc: JSX.Element[],
      player: SessionPlayer
    ) => {
      return [
        ...acc,
        <LobbyPlayerCard
          key={key}
          name={player.name}
          avatar={"http://placekitten.com/32/32"}
          status={player.status}
        />,
      ];
    };

    const renderPlayer = (acc: JSX.Element, player: SessionPlayer) => (
      <LobbyPlayerCard
        name={player.name}
        avatar={"http://placekitten.com/32/32"}
        status={player.status}
      />
    );

    const adminPlayer = pipe(
      currentSession.players,
      R.filterWithIndex(filterAdminPlayer),
      R.reduce<SessionPlayer, JSX.Element>(<></>, renderPlayer)
    );

    const currentPlayer = pipe(
      currentSession.players,
      R.filterWithIndex(filterCurrentPlayer),
      R.reduce<SessionPlayer, JSX.Element>(<></>, renderPlayer)
    );

    const commonPlayers = pipe(
      currentSession.players,
      R.filterMapWithIndex(filterCommonPlayers),
      R.reduceWithIndex<string, SessionPlayer, JSX.Element[]>(
        [],
        renderPlayerArea
      )
    );

    return (
      <PlayersWrapper>
        {/* Checks if current player is admin */}
        {!isAdmin && <CurrentPlayer>{currentPlayer}</CurrentPlayer>}
        <AdminPlayer>{adminPlayer}</AdminPlayer>
        {commonPlayers}
      </PlayersWrapper>
    );
  };

  return pipe(
    currentSessionPlayer,
    O.fold(
      () => <div />,
      (player) => (
        <Page>
          <Title>Room Code</Title>
          <Code>{currentSession.code}</Code>
          <Title>Players</Title>
          {getPlayersGrid()}
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
        </Page>
      )
    )
  );
}
