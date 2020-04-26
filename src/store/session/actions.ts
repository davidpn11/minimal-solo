import { Dispatch } from "redux";
import { Player } from "../../model/Player";
import {
  requestCreateSession,
  requestJoinSession,
  requestAddPlayer,
} from "../../api/db/session";
import { LocalSessionWithId, Normalized } from "../../model/Session";

export const CREATE_SESSION = "CREATE_SESSION" as const;
export const SET_PLAYER = "SET_PLAYER" as const;
export const CLEAR_SESSION = "CLEAR_SESSION" as const;

function setGameSession(session: LocalSessionWithId) {
  return {
    type: CREATE_SESSION,
    payload: session,
  };
}

export function clearSession() {
  return {
    type: CLEAR_SESSION,
  };
}

function addPlayers(player: Normalized<Player>) {
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

export function addNewPlayer(player: Normalized<Player>) {
  return async (dispatch: Dispatch) => {
    dispatch(addPlayers(player));
  };
}
export function joinGameSession(sessionCode: string, name: string) {
  return async (dispatch: Dispatch) => {
    try {
      const session = await requestJoinSession(sessionCode);
      const player = await requestAddPlayer(session.id, name);
      dispatch(setGameSession(session));
      dispatch(addPlayers(player));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
}

export type SessionActionTypes = ReturnType<
  typeof setGameSession | typeof addPlayers | typeof clearSession
>;
