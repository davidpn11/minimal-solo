import { Player } from '../../model/Player';
import { PlayerActionTypes } from './actions';

const initialState: Player = {
  id: '',
  hand: {},
};

const starterState: Player = {
  id: 'J8h4cn1KClXvziBKERdF',
  hand: {},
};

export function playerReducer(state = starterState, action: PlayerActionTypes): Player {
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
