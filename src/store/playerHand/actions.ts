import { ThunkDispatch } from 'redux-thunk';
import { Player } from '../../model/Player';

export const ADD_PLAYER = 'SET_PLAYER' as const;
export const SET_PLAYER_ID = 'SET_PLAYER_ID' as const;

export function setPlayer(player: Player) {
  return {
    type: ADD_PLAYER,
    payload: player,
  };
}

export function setPlayerId(playerId: string) {
  return {
    type: SET_PLAYER_ID,
    payload: playerId,
  };
}

export type PlayerActionTypes = ReturnType<typeof setPlayer | typeof setPlayerId>;

export type PlayerThunkDispatch = ThunkDispatch<Player, {}, PlayerActionTypes>;
