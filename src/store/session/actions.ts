import { batch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import * as A from 'fp-ts/lib/Array';

import { SessionPlayer, SessionPlayerWithId, PlayerStatus } from '../../model/Player';
import {
  requestCreateSession,
  requestJoinSession,
  requestAddPlayer,
  requestTogglePlayerStatus,
  requestDealStartHands,
  initGameSession,
} from '../../api/db/preGameSession';
import { LocalSessionWithId, Normalized, Play } from '../../model/Session';
import { ThunkResult } from '../types';
import { ReduxStore } from '../rootReducer';

export const SET_SESSION = 'SET_SESSION' as const;
export const ADD_PLAYER = 'ADD_PLAYER' as const;
export const CLEAR_SESSION = 'CLEAR_SESSION' as const;
export const SET_PLAYER_STATUS = 'SET_PLAYER_STATUS' as const;
export const SET_GAME_PROGRESSION = 'SET_GAME_PROGRESSION' as const;
export const SETUP_GAME = 'SETUP_GAME' as const;

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

function addPlayers(player: Normalized<SessionPlayer>) {
  return {
    type: ADD_PLAYER,
    payload: player,
  };
}

function setupGame() {
  return {
    type: SETUP_GAME,
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

export function addNewPlayer(player: Normalized<SessionPlayer>) {
  return async (dispatch: SessionThunkDispatch) => {
    dispatch(addPlayers(player));
  };
}

export function joinGameSession(
  sessionCode: string,
  name: string,
  playerId: string,
): SessionThunkResult<E.Either<LocalSessionWithId, any>> {
  return async (dispatch: SessionThunkDispatch) => {
    try {
      const { session, playersCount } = await requestJoinSession(sessionCode);
      const player = await requestAddPlayer(session.id, name, playerId, playersCount);
      batch(() => {
        dispatch(setGameSession(session));
        dispatch(addPlayers({ [playerId]: player }));
      });
      return E.right(session);
    } catch (error) {
      console.error(error);
      return E.left(error);
    }
  };
}

export async function togglePlayerStatus(
  sessionId: string,
  playerId: string,
  playerStatus: PlayerStatus,
) {
  try {
    await requestTogglePlayerStatus(sessionId, playerId, playerStatus);
  } catch (error) {
    console.error(error);
  }
}

function normalizePlayers(players: SessionPlayerWithId[]): Normalized<SessionPlayer> {
  const playerWithIdToNormalized = (acc: Normalized<SessionPlayer>, p: SessionPlayerWithId) => {
    const { id, ...playerRest } = p;

    return { ...acc, [id]: playerRest };
  };
  return pipe(players, A.reduce({}, playerWithIdToNormalized));
}

export function startGameSession() {
  return async (dispatch: SessionThunkDispatch, getState: () => ReduxStore) => {
    try {
      const state = getState();

      if (O.isNone(state.session)) throw new Error('Cannot start game on no session.');

      // Set game starting
      dispatch(setupGame());

      //Populates player hands
      const players = await requestDealStartHands(state.session.value);
      //Set initial session
      const startedGameSession = await initGameSession(
        state.session.value,
        normalizePlayers(players),
      );
      dispatch(setGameSession(startedGameSession));
    } catch (error) {
      console.error(error);
    }
  };
}

export type SessionActionTypes = ReturnType<
  | typeof setGameSession
  | typeof addPlayers
  | typeof clearSession
  | typeof setPlayer
  | typeof setGameProgression
  | typeof setupGame
>;
