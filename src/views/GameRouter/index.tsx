import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { GameWrapper } from "./styles";
import MyHand from "./components/MyHand";
import GameTable from "./components/GameTable";
import { getSession } from "../../store/session/selectors";
import Lobby from "../Lobby";
import GameEngine from "../../engine";
import { useSessionListener } from "../../hooks/useSessionListener";

const TEST_MODE = true;

export default function GameRouter() {
  const currentSession = useSelector(getSession);
  const history = useHistory();
  const hasSession = !!currentSession.code;
  useSessionListener();

  if (!hasSession && !TEST_MODE) {
    history.push("/");
  }

  switch (currentSession.status) {
    case "INITIAL":
      return <Lobby />;
    case "STARTED":
      return (
        <GameEngine>
          <GameWrapper>
            <GameTable />
            <MyHand />
          </GameWrapper>
        </GameEngine>
      );
    default:
      throw new Error("Not a valid session status");
  }
}
