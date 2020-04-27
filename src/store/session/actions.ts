import {
  SessionPlayer,
  SessionPlayerWithId,
  PlayerStatus,
} from "../../model/Player";
import {
  requestCreateSession,
  requestJoinSession,
  requestAddPlayer,
  requestTogglePlayerStatus,
} from "../../api/db/session";
import { LocalSessionWithId, Normalized } from "../../model/Session";
import { ThunkDispatch } from "redux-thunk";
import { ThunkResult } from "../types";

export const CREATE_SESSION = "CREATE_SESSION" as const;
export const ADD_PLAYER = "ADD_PLAYER" as const;
export const CLEAR_SESSION = "CLEAR_SESSION" as const;
export const SET_PLAYER_STATUS = "SET_PLAYER_STATUS" as const;

export type SessionThunkDispatch = ThunkDispatch<
  LocalSessionWithId,
  {},
  SessionActionTypes
>;
export type SessionThunkResult<T> = ThunkResult<
  T,
  LocalSessionWithId,
  SessionActionTypes
>;
// export type SessionThunkResult = ThunkResult
function setGameSession(session: LocalSessionWithId) {
  return {
    type: CREATE_SESSION,
    payload: session,
  };
}

function setPlayer(player: SessionPlayerWithId) {
  return {
    type: SET_PLAYER_STATUS,
    payload: player,
  };
}

export function clearSession() {
  return {
    type: CLEAR_SESSION,
  };
}

function addPlayers(player: Normalized<SessionPlayer>) {
  return {
    type: ADD_PLAYER,
    payload: player,
  };
}

export function createGameSession(name: string) {
  return async (dispatch: SessionThunkDispatch) => {
    try {
      const session = await requestCreateSession(name);
      dispatch(setGameSession(session));
      return session;
    } catch (error) {
      console.error(error);
    }
  };
}

export function addNewPlayer(player: Normalized<SessionPlayer>) {
  return async (dispatch: SessionThunkDispatch) => {
    dispatch(addPlayers(player));
  };
}
export function joinGameSession(
  sessionCode: string,
  name: string
): SessionThunkResult<boolean> {
  return async (dispatch: SessionThunkDispatch) => {
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

export async function togglePlayerStatus(
  sessionId: string,
  playerId: string,
  playerStatus: PlayerStatus
) {
  const result = await requestTogglePlayerStatus(
    sessionId,
    playerId,
    playerStatus
  );
  console.log({ result });
}

export type SessionActionTypes = ReturnType<
  | typeof setGameSession
  | typeof addPlayers
  | typeof clearSession
  | typeof setPlayer
>;
