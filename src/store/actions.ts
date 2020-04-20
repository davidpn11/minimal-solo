import { Dispatch } from "redux";
import { Player, PlayerWithId } from "../model/Player";
import { requestCreateSession, requestAddPlayer } from "../api/db/session";
import { SessionWithId } from "../model/Session";
import { buildOne } from "../model/Card";
export const CREATE_SESSION = "CREATE_SESSION" as const;
export const SET_PLAYER = "SET_PLAYER" as const;

function setGameSession(session: SessionWithId) {
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
      // const player = await requestAddPlayer(session.id, {
      //   name,
      //   hand: [],
      //   uno: false,
      // });

      // console.log({ session });

      // dispatch(setPlayer(player))
      // const player2 = await requestSetPlayer(session.id, {
      //   name: "name",
      //   hand: [],
      //   uno: false,
      // });
      // console.log({ player });
      // const result = await requestGetSession(session.id);
      // console.log(result.data());
    } catch (error) {
      console.error(error);
    }
  };
}

export type SessionActionTypes = ReturnType<typeof setGameSession>;
