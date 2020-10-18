import { pipe } from 'fp-ts/lib/pipeable';

import {
  SET_PLAYERS,
  CLEAR_SESSION,
  SessionActionTypes,
  SET_SESSION,
  SET_GAME_PROGRESSION,
  SET_CURRENT_PLAY,
  SET_CURRENT_PLAYER,
  SET_CURRENT_CARD,
} from './actions';
import { foldGameSession } from './helpers/foldSession';

const initialState: NoSession = {
  status: 'INITIAL',
};

export function sessionReducer(state = initialState, action: SessionActionTypes): SessionStore {
  switch (action.type) {
    case SET_SESSION:
      return {
        ...state,
        ...action.payload,
      };
    case SET_GAME_PROGRESSION:
      return pipe(
        state,
        foldGameSession({
          whenGameStarted() {
            return {
              ...state,
              progression: action.payload,
            };
          },
        }),
      );
    case SET_PLAYERS:
      const mergePlayers = () => ({ ...state, players: action.payload });
      return pipe(
        state,
        foldGameSession({
          whenLobbySession: mergePlayers,
          whenGameStarted: mergePlayers,
          whenLoadingSession: mergePlayers,
        }),
      );
    case SET_CURRENT_PLAY:
      return pipe(
        state,
        foldGameSession({
          whenGameStarted: () => ({ ...state, currentPlay: action.payload }),
        }),
      );
    case SET_CURRENT_PLAYER:
      return pipe(
        state,
        foldGameSession({
          whenGameStarted: () => ({ ...state, currentPlayer: action.payload }),
        }),
      );
    case SET_CURRENT_CARD:
      return pipe(
        state,
        foldGameSession({
          whenGameStarted: () => ({ ...state, currentCard: action.payload }),
        }),
      );
    case CLEAR_SESSION:
      return initialState;
    default:
      return state;
  }
}
