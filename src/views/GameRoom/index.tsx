import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { GameWrapper } from "./styles";
import MyHand from "./components/MyHand";
import GameTable from "./components/GameTable";
import { getSession } from "../../store/session/selectors";
import { Title } from "../Lobby/styles";
import Lobby from "../Lobby";

export default function GameRoom() {
  const currentSession = useSelector(getSession);
  const hasSession = !!currentSession.code;

  if (!hasSession) {
    return <Title>Loading...</Title>;
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
