import * as O from 'fp-ts/lib/Option';
import { Player } from '../../model/Player';
import { PlayerActionTypes, SET_PLAYER, SET_PLAYER_HAND, SET_PLAYER_ID } from './actions';

const initialState: Player = {
  id: O.none,
  hand: {},
};

const starterState: Player = {
  id: O.some('J8h4cn1KClXvziBKERdF'),
  hand: {},
};

export function playerReducer(state = initialState, action: PlayerActionTypes): Player {
  switch (action.type) {
    case SET_PLAYER:
      return {
        ...state,
        ...action.payload,
      };
    case SET_PLAYER_HAND:
      return {
        ...state,
        hand: action.payload,
      };
    case SET_PLAYER_ID:
      return {
        ...state,
        id: O.some(action.payload),
      };
    default:
      return state;
  }
}
