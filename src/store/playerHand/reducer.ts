import * as O from 'fp-ts/lib/Option';
import { Player } from '../../model/Player';
import { PlayerActionTypes } from './actions';

const initialState: Player = {
  id: O.none,
  hand: {},
};

export function playerReducer(state = initialState, action: PlayerActionTypes): Player {
  switch (action.type) {
    case 'SET_PLAYER':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_PLAYER_ID':
      return {
        ...state,
        id: O.some(action.payload),
      };
    default:
      return state;
  }
}
