import { Player } from '../../model/Player';
import { PlayerActionTypes, SET_PLAYER, SET_PLAYER_HAND } from './actions';

const initialState: Player = {
  id: '',
  hand: {},
};

const starterState: Player = {
  id: 'J8h4cn1KClXvziBKERdF',
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
    default:
      return state;
  }
}
