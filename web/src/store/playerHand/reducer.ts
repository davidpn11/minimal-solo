import * as O from 'fp-ts/lib/Option';
import { Player } from '../../model/Player';
import { PlayerActionTypes, SET_PLAYER, SET_PLAYER_HAND, SET_PLAYER_ID } from './actions';
import { pipe } from 'fp-ts/lib/pipeable';

const initialState: O.Option<Player> = O.none;

export function playerReducer(state = initialState, action: PlayerActionTypes): O.Option<Player> {
  switch (action.type) {
    case SET_PLAYER:
      return O.some(action.payload);
    case SET_PLAYER_HAND:
      if (O.isNone(state)) throw new Error('Cannot set the hand of an inexistent player.');

      return O.some({
        ...state.value,
        hand: action.payload,
      });
    case SET_PLAYER_ID:
      return pipe(
        state,
        O.fold<Player, O.Option<Player>>(
          () => O.some({ id: action.payload, hand: {} }),
          state =>
            O.some({
              ...state,
              id: action.payload,
            }),
        ),
      );
    default:
      return state;
  }
}
