import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pipe } from "fp-ts/lib/pipeable";
import * as O from "fp-ts/lib/Option";

import { ActionWrapper, Code, Page, PlayersWrapper, Title } from "./styles";
import {
  requestSessionPlayersListener,
  requestTogglePlayerStatus,
} from "../../api/db/session";
import { Button } from "../../components/Button";
import { LobbyPlayerCard } from "../../components/LobbyPlayerCard";
import { PlayerStatus } from "../../model/Player";
import { addNewPlayer, clearSession } from "../../store/session/actions";
import {
  getCurrentSessionPlayer,
  getSession,
} from "../../store/session/selectors";
import {
  getPlayerId,
  isCurrentPlayerAdmin,
} from "../../store/playerHand/selector";

export default function Lobby() {
  const currentSession = useSelector(getSession);
  const currentPlayerId = useSelector(getPlayerId);
  const currentSessionPlayer = useSelector(getCurrentSessionPlayer);
  const isAdmin = useSelector(isCurrentPlayerAdmin);
  const dispatch = useDispatch();
  const [hasListener, setHasListener] = useState<boolean>(false);

  useEffect(() => {
    if (currentSession.id && !hasListener) {
      setHasListener(true);
      requestSessionPlayersListener(currentSession.id, (p) =>
        dispatch(addNewPlayer(p))
      );
    }

    return () => {
      dispatch(clearSession);
    };
  }, [currentSession.id, hasListener, dispatch]);

  const toggleStatus = (
    playerId: string,
    playerStatus: PlayerStatus
  ) => async () => {
    await requestTogglePlayerStatus(currentSession.id, playerId, playerStatus);
  };

  return pipe(
    currentSessionPlayer,
    O.fold(
      () => <div />,
      (player) => (
        <Page>
          <Title>Player Code</Title>
          <Code>{currentSession.code}</Code>
          <Title>Players</Title>
          <PlayersWrapper>
            {Object.entries(currentSession.players).map(([id, player]) => {
              return (
                <LobbyPlayerCard
                  key={id}
                  name={player.name}
                  avatar={"http://placekitten.com/32/32"}
                  status={player.status}
                />
              );
            })}
          </PlayersWrapper>
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
