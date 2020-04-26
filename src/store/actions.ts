import { Dispatch } from "redux";
import { Player, PlayerWithId } from "../model/Player";
import { requestCreateSession, requestAddPlayer } from "../api/db/session";
import { SessionWithId, LocalSessionWithId } from "../model/Session";
export const CREATE_SESSION = "CREATE_SESSION" as const;
export const SET_PLAYER = "SET_PLAYER" as const;

function setGameSession(session: LocalSessionWithId) {
  return {
    type: CREATE_SESSION,
    payload: session,
  };
}

function setPlayer(player: PlayerWithId) {
  return {
    type: SET_PLAYER,
    payload: player,
  };
}

export function createGameSession(name: string) {
  return async (dispatch: Dispatch) => {
    try {
      const session = await requestCreateSession(name);
      dispatch(setGameSession(session));
      return session;
    } catch (error) {
      console.error(error);
    }
  };
}

export type SessionActionTypes = ReturnType<typeof setGameSession>;
