import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  requestSessionPlayersListener,
  requestTogglePlayerStatus,
} from "../../api/db/session";
import { LocalSessionWithId } from "../../model/Session";
import { ReduxStore } from "../../store/rootReducer";
import { addNewPlayer, clearSession } from "../../store/session/actions";
import { LobbyPlayerCard } from "../../components/LobbyPlayerCard";
import { PlayerStatus } from "../../model/Player";
import { setPlayer } from "../../store/playerHand/actions";

const getSession = (state: ReduxStore): LocalSessionWithId => state.session;

export default function Lobby() {
  const currentSession = useSelector(getSession);
  const dispatch = useDispatch();
  const [hasListener, setHasListener] = useState<boolean>(false);

  useEffect(() => {
    if (currentSession.id && !hasListener) {
      setHasListener(true);
      dispatch(setPlayer({ id: currentSession.admin, hand: {} }));
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

  //TODO: IMPROVE TOOGLE STATUS LOGIC
  const players = Object.keys(currentSession.players).reduce(
    (acc: JSX.Element[], id) => {
      const player = currentSession.players[id];
      const isAdmin = player.status === "ADMIN";
      return [
        ...acc,
        <span key={id} style={{ display: "flex" }}>
          <LobbyPlayerCard {...player} avatar={""} />
          {!isAdmin && (
            <button onClick={toggleStatus(id, player.status)}>
              {player.status === "READY" ? "NOT READY" : "READY"}
            </button>
          )}
        </span>,
      ];
    },
    []
  );

  const hasSession = !!currentSession.code;
  return (
    <div>
      {hasSession ? (
        <>
          <h3>Admin: {currentSession.admin}</h3>
          <h3>CODE: {currentSession.code} </h3>
          <hr />
          <h2>Players</h2>

          {players}
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}
