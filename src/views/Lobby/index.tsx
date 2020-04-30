import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pipe } from "fp-ts/lib/pipeable";
import * as O from "fp-ts/lib/Option";
import * as R from "fp-ts/lib/Record";

import { ActionWrapper, Code, Page, PlayersWrapper, Title } from "./styles";
import {
  requestSessionPlayersListener,
  requestTogglePlayerStatus,
} from "../../api/db/session";
import { Button } from "../../components/Button";
import { LobbyPlayerCard } from "../../components/LobbyPlayerCard";
import { PlayerStatus, SessionPlayer } from "../../model/Player";
import { addNewPlayer, clearSession } from "../../store/session/actions";
import {
  getCurrentSessionPlayer,
  getSession,
} from "../../store/session/selectors";
import {
  getPlayerId,
  isCurrentPlayerAdmin,
} from "../../store/playerHand/selector";
import { LocalSessionWithId } from "../../model/Session";

type Props = {
  isTest: boolean;
};

const SESSION: LocalSessionWithId = {
  id: "ACeKB3PFRXkvv6QdyCHw",
  code: "42886",
  status: "INITIAL",
  players: {
    "2": { status: "NOT_READY", hand: [], name: "John" },
    "3": { status: "NOT_READY", hand: [], name: "Kevin" },
    "4": { status: "NOT_READY", hand: [], name: "Max" },
    "6": { status: "NOT_READY", hand: [], name: "Rob" },
    "7": { status: "NOT_READY", hand: [], name: "Alex" },
    "2zqR87wtl8zrzXwW43HH": { status: "READY", hand: [], name: "Jamie" },
    "8": { status: "NOT_READY", hand: [], name: "Bruce" },
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

export default function Lobby(props: Props) {
  const currentSession = SESSION; //props.isTest ? SESSION : useSelector(getSession);
  const currentPlayerId = "2zqR87wtl8zrzXwW43HH"; //useSelector(getPlayerId);
  const currentSessionPlayer = PLAYER; //useSelector(getCurrentSessionPlayer);
  const isAdmin = useSelector(isCurrentPlayerAdmin);

  const toggleStatus = (
    playerId: string,
    playerStatus: PlayerStatus
  ) => async () => {
    await requestTogglePlayerStatus(currentSession.id, playerId, playerStatus);
  };

  const getPlayersGrid = () => {
    const isCurrentPlayer = (id: string) => currentPlayerId === id;
    const isAdmin = (player: SessionPlayer) => player.status === "ADMIN";

    const filterCurrentPlayer = (key: string) => isCurrentPlayer(key);
    const filterAdminPlayer = (key: string, value: SessionPlayer) =>
      isAdmin(value);

    const filterCommonPlayers = (key: string, value: SessionPlayer) => {
      if (isCurrentPlayer(key) || isAdmin(value)) return O.none;
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
        {currentPlayer}
        {adminPlayer}
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
              <Button>Start Game</Button>
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
