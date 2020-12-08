import { ThunkDispatch } from 'redux-thunk';
import * as E from 'fp-ts/lib/Either';
import axios from 'axios';
import { pipe } from 'fp-ts/lib/pipeable';
import { foldGameSession } from '@mikelfcosta/solo-lib/lib/session';

import {
  requestCreateSession,
  requestJoinSession,
  requestAddPlayer,
} from '../../api/db/preGameSession';
import { ThunkResult } from '../types';
import { ReduxStore } from '../rootReducer';
import { requestAddPlay } from '../../api/db/gameSession';
import { captureLog } from '../../utils/sentry';
import { firebaseConfig } from '../../api/config';

export const SET_SESSION = 'SET_SESSION' as const;
export const SET_PLAYERS = 'SET_PLAYERS' as const;
export const CLEAR_SESSION = 'CLEAR_SESSION' as const;
export const SET_PLAYER_STATUS = 'SET_PLAYER_STATUS' as const;
export const SET_GAME_PROGRESSION = 'SET_GAME_PROGRESSION' as const;
export const SET_CURRENT_PLAYER = 'SET_CURRENT_PLAYER' as const;
export const SET_CURRENT_PLAY = 'SET_CURRENT_PLAY' as const;
export const SET_CURRENT_CARD = 'SET_CURRENT_CARD' as const;
export const SET_GAME_DIRECTION = 'SET_GAME_DIRECTION' as const;

export type SessionThunkDispatch = ThunkDispatch<LocalSessionWithId, {}, SessionActionTypes>;
export type SessionThunkResult<T> = ThunkResult<T, LocalSessionWithId, SessionActionTypes>;

export function setGameSession(session: LocalSessionWithId) {
  return {
    type: SET_SESSION,
    payload: session,
  };
}
export function setGameProgression(progression: Normalized<Play>) {
  return {
    type: SET_GAME_PROGRESSION,
    payload: progression,
  };
}

function setPlayer(player: SessionPlayerWithId) {
  return {
    type: SET_PLAYER_STATUS,
    payload: player,
  };
}

export function clearSession() {
  return {
    type: CLEAR_SESSION,
  };
}

export function setPlayers(player: Normalized<SessionPlayer>) {
  return {
    type: SET_PLAYERS,
    payload: player,
  };
}

export function setCurrentPlayer(playerId: string) {
  return {
    type: SET_CURRENT_PLAYER,
    payload: playerId,
  };
}

export function setCurrentPlay(playId: string) {
  return {
    type: SET_CURRENT_PLAY,
    payload: playId,
  };
}

export function setCurrentCard(card: Card) {
  return {
    type: SET_CURRENT_CARD,
    payload: card,
  };
}

export function setGameDirection(direction: GameDirection) {
  return {
    type: SET_GAME_DIRECTION,
    payload: direction,
  };
}

export function createGameSession(
  name: string,
  playerId: string,
): SessionThunkResult<E.Either<LocalSessionWithId, any>> {
  return async (dispatch: SessionThunkDispatch) => {
    try {
      const session = await requestCreateSession(name, playerId);
      dispatch(setGameSession(session));
      return E.right(session);
    } catch (error) {
      console.error(error);
      return E.left(error);
    }
  };
}

export function joinGameSession(
  sessionCode: string,
  name: string,
  playerId: string,
): SessionThunkResult<E.Either<LocalSessionWithId, any>> {
  return async () => {
    try {
      const { session, playersCount } = await requestJoinSession(sessionCode);
      await requestAddPlayer(session.id, name, playerId, playersCount);

      return E.right(session);
    } catch (error) {
      captureLog(error);
      return E.left(error);
    }
  };
}

export function startGameSession(sessionId: string) {
  return async (dispatch: SessionThunkDispatch) => {
    try {
      const response = await axios.request({
        method: 'POST',
        baseURL: firebaseConfig.baseApi,
        url: `/lobby/${sessionId}/start`,
      });

      dispatch(setGameSession(response.data));
    } catch (error) {
      console.error(error);
    }
  };
}

export function addPlay(play: Play) {
  return async (dispatch: SessionThunkDispatch, getState: () => ReduxStore) => {
    try {
      const { session } = getState();
      pipe(
        session,
        foldGameSession({
          whenGameStarted: async s => {
            await requestAddPlay(s.id, play);
          },
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };
}

export function reverseGameDirection() {
  return async (dispatch: SessionThunkDispatch, getState: () => ReduxStore) => {
    try {
      const { session } = getState();
      pipe(
        session,
        foldGameSession({
          whenGameStarted: async s => {
            const nextDirection: GameDirection = s.direction === 'LEFT' ? 'RIGHT' : 'LEFT';
            dispatch(setGameDirection(nextDirection));
          },
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };
}

export type SessionActionTypes = ReturnType<
  | typeof setGameSession
  | typeof setPlayers
  | typeof clearSession
  | typeof setPlayer
  | typeof setGameProgression
  | typeof setCurrentPlayer
  | typeof setCurrentPlay
  | typeof setCurrentCard
  | typeof setGameDirection
>;
