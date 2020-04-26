import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestSessionPlayersListener } from "../../api/db/session";
import { LocalSessionWithId } from "../../model/Session";
import { ReduxStore } from "../../store/rootReducer";
import { addNewPlayer, clearSession } from "../../store/session/actions";
import { LobbyPlayerCard } from "../../components/LobbyPlayerCard";

const getSession = (state: ReduxStore): LocalSessionWithId => state.session;

export default function Lobby() {
  const currentSession = useSelector(getSession);
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
  const players = Object.keys(currentSession.players).reduce(
    (acc: JSX.Element[], id) => {
      const player = currentSession.players[id];
      return [...acc, <LobbyPlayerCard key={id} {...player} avatar={""} />];
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
