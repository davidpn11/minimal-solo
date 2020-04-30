import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { GameWrapper } from "./styles";
import MyHand from "./components/MyHand";
import GameTable from "./components/GameTable";
import { getSession } from "../../store/session/selectors";
import Lobby from "../Lobby";
import { requestSessionPlayersListener } from "../../api/db/session";
import { addNewPlayer, clearSession } from "../../store/session/actions";

const TEST_MODE = true;

export default function GameRoom() {
  const currentSession = useSelector(getSession);
  const history = useHistory();
  const hasSession = !!currentSession.code;
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

  if (!hasSession && !TEST_MODE) {
    history.push("/");
  }

  switch (currentSession.status) {
    case "INITIAL":
      return <Lobby isTest={TEST_MODE} />;
    case "STARTED":
      return (
        <GameWrapper>
          <GameTable />
          <MyHand />
        </GameWrapper>
      );
    default:
      throw new Error("Not a valid session status");
  }
}
