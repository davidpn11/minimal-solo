import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

import {
  ADD_PLAYER,
  CLEAR_SESSION,
  SessionActionTypes,
  SET_SESSION,
  SET_GAME_PROGRESSION,
  SET_CURRENT_PLAY,
  SET_CURRENT_PLAYER,
  SET_CURRENT_CARD,
} from './actions';
import { LocalSessionWithId } from '../../model/Session';

const initialState: O.Option<LocalSessionWithId> = O.none;

export function sessionReducer(
  stateO = initialState,
  action: SessionActionTypes,
): O.Option<LocalSessionWithId> {
  switch (action.type) {
    case SET_SESSION:
      return pipe(
        stateO,
        O.fold<LocalSessionWithId, O.Option<LocalSessionWithId>>(
          () => O.some(action.payload),
          state => {
            return O.some({
              ...state,
              ...action.payload,
            });
          },
        ),
      );
    case CLEAR_SESSION:
      return initialState;
    case SET_GAME_PROGRESSION:
      if (O.isNone(stateO)) throw new Error('Cannot set progression to unexistent session.');

      return O.some({
        ...stateO.value,
        progression: action.payload,
      });
    case ADD_PLAYER:
      if (O.isNone(stateO)) throw new Error('Cannot add player to unexistent session.');

      return O.some({
        ...stateO.value,
        players: {
          ...stateO.value.players,
          ...action.payload,
        },
      });
    case SET_CURRENT_PLAY:
      if (O.isNone(stateO)) throw new Error('Cannot set current play on unexistent session.');

      return O.some({
        ...stateO.value,
        currentPlay: action.payload,
      });
    case SET_CURRENT_PLAYER:
      if (O.isNone(stateO)) throw new Error('Cannot set current player on unexistent session.');

      return O.some({
        ...stateO.value,
        currentPlayer: action.payload,
      });
    case SET_CURRENT_CARD:
      if (O.isNone(stateO)) throw new Error('Cannot set current player on unexistent session.');

      return O.some({
        ...stateO.value,
        currentCard: action.payload,
      });
    default:
      return stateO;
  }
}
