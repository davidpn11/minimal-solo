import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { GameWrapper } from "./styles";
import MyHand from "./components/MyHand";
import GameTable from "./components/GameTable";
import { getSession } from "../../store/session/selectors";
import Lobby from "../Lobby";

export default function GameRoom() {
  const currentSession = useSelector(getSession);
  const history = useHistory();
  const hasSession = !!currentSession.code;

  if (!hasSession) {
    history.push("/");
  }

  switch (currentSession.status) {
    case "INITIAL":
      return <Lobby />;
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
