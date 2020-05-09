import { Player } from '../../model/Player';
import { PlayerActionTypes } from './actions';

const initialState: Player = {
  id: '',
  hand: {},
};

export function playerReducer(state = initialState, action: PlayerActionTypes): Player {
  switch (action.type) {
    case 'SET_PLAYER':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
