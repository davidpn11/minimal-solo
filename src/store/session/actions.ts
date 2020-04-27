import { ThunkDispatch } from "redux-thunk";
import * as E from "fp-ts/lib/Either";

import {
  SessionPlayer,
  SessionPlayerWithId,
  PlayerStatus,
  Player,
} from "../../model/Player";
import {
  requestCreateSession,
  requestJoinSession,
  requestAddPlayer,
  requestTogglePlayerStatus,
} from "../../api/db/session";
import { LocalSessionWithId, Normalized } from "../../model/Session";
import { ThunkResult } from "../types";
import { PlayerActionTypes } from "../playerHand/actions";

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

export function createGameSession(
  name: string
): SessionThunkResult<E.Either<LocalSessionWithId, any>> {
  return async (dispatch: SessionThunkDispatch) => {
    try {
      const session = await requestCreateSession(name);
      dispatch(setGameSession(session));
      return E.right(session);
    } catch (error) {
      console.error(error);
      return E.left(error);
    }
  };
}

export function addNewPlayer(player: Normalized<SessionPlayer>) {
  return async (dispatch: SessionThunkDispatch) => {
    dispatch(addPlayers(player));
  };
}

export type JoinGameSessionReturn = {
  session: LocalSessionWithId;
  player: SessionPlayerWithId;
};
export function joinGameSession(
  sessionCode: string,
  name: string
): SessionThunkResult<E.Either<JoinGameSessionReturn, any>> {
  return async (dispatch: SessionThunkDispatch) => {
    try {
      const session = await requestJoinSession(sessionCode);
      const player = await requestAddPlayer(session.id, name);
      dispatch(setGameSession(session));
      dispatch(addPlayers({ [player.id]: player }));
      return E.right({ player, session });
    } catch (error) {
      console.error(error);
      return E.left(error);
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
