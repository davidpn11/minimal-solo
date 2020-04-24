import React from "react";
import { useSelector } from "react-redux";
import { SessionWithId } from "../../model/Session";
import { ReduxStore } from "../../store/reducers";
//TODO

const getSession = (state: ReduxStore): SessionWithId => state.session;

export default function Lobby() {
  const session = useSelector(getSession);
  console.log(session);

  const hasSession = !!session.code;

  return (
    <div>
      {hasSession ? (
        <>
          <h2>Admin: {session.admin}</h2>
          <h2>CODE: {session.code} </h2>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}
