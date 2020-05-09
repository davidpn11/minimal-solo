import { ThunkDispatch } from 'redux-thunk';
import { Player } from '../../model/Player';
import { Normalized } from '../../model/Session';
import { Card } from '../../model/Card';
import { ThunkResult } from '../types';
import { ReduxStore } from '../rootReducer';
import { requestGetPlayerHand } from '../../api/db/gameSession';

export const SET_PLAYER = 'SET_PLAYER' as const;
export const SET_PLAYER_HAND = 'SET_PLAYER_HAND' as const;

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

export function getPlayerHand(sessionId: string, hand: string[]) {
  return async (dispatch: PlayerThunkDispatch) => {
    try {
      // console.log({ hand });
      const normalizedHand = await requestGetPlayerHand(sessionId, hand);
      // console.log({ normalizedHand });
      dispatch(setPlayerHand(normalizedHand));
    } catch (error) {
      console.error(error);
    }
  };
}

export type PlayerActionTypes = ReturnType<typeof setPlayer> | ReturnType<typeof setPlayerHand>;
