import { ThunkDispatch } from 'redux-thunk';

import { ThunkResult } from '../types';
import { Normalized } from '../../model/Session';
import { requestGetPlayerHand } from '../../api/db/gameSession';

export const SET_PLAYER = 'SET_PLAYER' as const;
export const SET_PLAYER_HAND = 'SET_PLAYER_HAND' as const;
export const SET_PLAYER_ID = 'SET_PLAYER_ID' as const;

export type PlayerThunkDispatch = ThunkDispatch<Player, {}, PlayerActionTypes>;
export type PlayerThunkResult<T> = ThunkResult<T, Player, PlayerActionTypes>;

export function setPlayer(player: Player) {
  return {
    type: SET_PLAYER,
    payload: player,
  };
}

export function setPlayerHand(hand: Normalized<Card>) {
  return {
    type: SET_PLAYER_HAND,
    payload: hand,
  };
}
export function setPlayerId(playerId: string) {
  return {
    type: SET_PLAYER_ID,
    payload: playerId,
  };
}

export function getPlayerHand(sessionId: string, hand: string[]) {
  return async (dispatch: PlayerThunkDispatch) => {
    try {
      const normalizedHand = await requestGetPlayerHand(sessionId, hand);
      dispatch(setPlayerHand(normalizedHand));
    } catch (error) {
      console.error(error);
    }
  };
}

export type PlayerActionTypes =
  | ReturnType<typeof setPlayer>
  | ReturnType<typeof setPlayerId>
  | ReturnType<typeof setPlayerHand>;
