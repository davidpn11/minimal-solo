import { ThunkDispatch } from "redux-thunk";
import { Player } from "../../model/Player";

export const ADD_PLAYER = "SET_PLAYER" as const;

export function setPlayer(player: Player) {
  return {
    type: ADD_PLAYER,
    payload: player,
  };
}

export type PlayerActionTypes = ReturnType<typeof setPlayer>;

export type PlayerThunkDispatch = ThunkDispatch<Player, {}, PlayerActionTypes>;
