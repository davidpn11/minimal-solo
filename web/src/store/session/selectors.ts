import * as O from 'fp-ts/lib/Option';
import * as R from 'fp-ts/lib/Record';
import * as A from 'fp-ts/lib/Array';
import * as F from 'fp-ts/lib/function';
import { Ord, ordNumber, contramap } from 'fp-ts/lib/Ord';
import { pipe } from 'fp-ts/lib/pipeable';
import { foldGameSession } from '@mikelfcosta/solo-lib/lib/session';
import { getOrThrow } from '@mikelfcosta/solo-lib/lib/utils';

import { ReduxStore } from '../rootReducer';
import { MIN_ROOM_SIZE } from '../../api/db/preGameSession';
import { PlayerActions, initialPlayerActions } from './helpers/types';
import { getPlayerValue } from '../playerHand/selector';

export const getSessionState = (state: ReduxStore): SessionStore => state.session;

export const getSession = (state: ReduxStore): LocalSessionWithId => {
  return pipe(
    state.session,
    foldGameSession<LocalSessionWithId>({
      whenLoadingSession: F.identity,
      whenGameStarted: F.identity,
      whenLobbySession: F.identity,
    }),
  );
};

//Real usage
export const getStartedSession = (state: ReduxStore): LocalGameSessionWithId => {
  return pipe(
    state.session,
    foldGameSession({
      whenGameStarted: session => session,
    }),
    getOrThrow,
  );
};

export const getCurrentSessionPlayer = (state: ReduxStore): O.Option<SessionPlayer> =>
  pipe(
    state.player,
    O.chain(player =>
      pipe(
        state.session,
        foldGameSession({
          whenLobbySession: session => R.lookup(player.id, session.players),
          whenLoadingSession: session => R.lookup(player.id, session.players),
          whenGameStarted: session => R.lookup(player.id, session.players),
        }),
      ),
    ),
  );

export const getCurrentSessionPlayerValue = (state: ReduxStore): SessionPlayer =>
  pipe(
    getCurrentSessionPlayer(state),
    O.fold(
      () => {
        throw new Error('Cannot read current session player without being a part of it.');
      },
      player => player,
    ),
  );

function handleSession(session: LocalNoGameSessionWithId) {
  if (R.size(session.players) < MIN_ROOM_SIZE) return false;
  return pipe(
    session.players,
    R.filter(player => player.status !== 'ADMIN'),
    R.every(player => player.status === 'READY'),
  );
}

export const allPlayersReady = (state: ReduxStore): boolean =>
  pipe(
    state.session,
    foldGameSession({
      whenLobbySession: handleSession,
      whenLoadingSession: handleSession,
    }),
    getOrThrow,
  );

export const getAllPlayers = (state: ReduxStore): Normalized<SessionPlayer> =>
  pipe(
    state.session,
    foldGameSession({
      whenLobbySession: session => session.players,
      whenLoadingSession: session => session.players,
      whenGameStarted: session => session.players,
    }),
  );

export function getNextPosition(session: LocalGameSessionWithId, currentPlayerPosition: number) {
  const currentDirection = session.direction;
  const lastPlayerPosition = R.keys(session.players).length - 1;
  const isFirstPosition = currentPlayerPosition === 0;
  const isLastPosition = currentPlayerPosition === lastPlayerPosition;

  switch (currentDirection) {
    case 'LEFT':
      return isFirstPosition ? lastPlayerPosition : currentPlayerPosition + 1;
    case 'RIGHT':
      return isLastPosition ? 0 : currentPlayerPosition + 1;
  }
}

export const getNextPlayerPosition = (state: ReduxStore): number => {
  return pipe(
    state.session,
    foldGameSession({
      whenGameStarted: session => {
        const currentPlayerPosition = pipe(
          R.lookup(session.currentPlayer, session.players),
          O.fold(
            () => {
              throw new Error('');
            },
            player => player.position,
          ),
        );

        return getNextPosition(session, currentPlayerPosition);
      },
    }),
    getOrThrow,
  );
};

export const getNextPlayer = (state: ReduxStore) =>
  pipe(
    getOrderedPlayers(state),
    A.findFirst(player => player.position === getNextPlayerPosition(state)),
    O.fold(
      () => {
        throw new Error(`Cannot get player position ${getNextPlayerPosition(state)}`);
      },
      player => player,
    ),
  );

export const ordPlayersByPosition: Ord<SessionPlayerWithId> = pipe(
  ordNumber,
  contramap(player => player.position),
);

export const getOrderedPlayers = (state: ReduxStore): SessionPlayerWithId[] =>
  pipe(
    state.session,
    foldGameSession({
      whenGameStarted: session =>
        pipe(
          R.toArray(session.players),
          A.map<[string, SessionPlayer], SessionPlayerWithId>(([id, player]) => ({
            id,
            ...player,
          })),
          A.sort(ordPlayersByPosition),
        ),
    }),
  );

export const getPlays = (state: ReduxStore): Play[] => {
  return pipe(
    state.session,
    foldGameSession({
      whenGameStarted: session => Object.values(session.progression),
    }),
  );
};

export const getOtherSessionPlayers = (state: ReduxStore): Normalized<SessionPlayer> => {
  const playerId = O.isSome(state.player) ? state.player.value.id : '';
  const getPlayersFromSession = (session: LocalSessionWithId) =>
    pipe(
      session.players,
      R.filterWithIndex(key => key !== playerId),
    );

  return pipe(
    state.session,
    foldGameSession({
      whenLobbySession: getPlayersFromSession,
      whenLoadingSession: getPlayersFromSession,
      whenGameStarted: getPlayersFromSession,
    }),
  );
};

export const getCurrentCard = (state: ReduxStore): Card =>
  pipe(
    state.session,
    foldGameSession({
      whenGameStarted: session => session.currentCard,
    }),
  );

export const getPlayerActions = (state: ReduxStore): PlayerActions => {
  const player = getPlayerValue(state);
  const currentPlayer = getCurrentPlayer(state);

  if (player.id === currentPlayer) {
    return {
      ...initialPlayerActions,
      soloAction: Object.keys(player.hand).length === 1 ? 'CAN_SOLO' : 'CANNOT_SOLO',
      passAction: 'CAN_PASS',
    };
  }

  return initialPlayerActions;
};

const ordPlaysByPosition: Ord<PlayWithId> = pipe(
  ordNumber,
  contramap(play => play.position),
);

export const getOrderedProgression = (state: ReduxStore): PlayWithId[] => {
  const session = getStartedSession(state);

  return pipe(
    session.progression || {},
    R.toArray,
    A.map(([id, play]) => ({ id, ...play })),
    A.sort(ordPlaysByPosition),
  );
};

export function getLastPlayPosition(state: ReduxStore): number {
  return pipe(
    state,
    getOrderedProgression,
    A.last,
    O.fold(
      () => -1, // will become 0 if it's the first
      play => play.position,
    ),
  );
}

export const getCurrentPlayer = (state: ReduxStore): string => {
  return pipe(getStartedSession(state), session => session.currentPlayer);
};

export const getCurrentPlay = (state: ReduxStore): string => {
  return pipe(getStartedSession(state), session => session.currentPlay);
};
