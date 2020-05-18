import * as O from 'fp-ts/lib/Option';
import * as R from 'fp-ts/lib/Record';
import * as A from 'fp-ts/lib/Array';
import { Ord, ordNumber, contramap } from 'fp-ts/lib/Ord';
import { pipe } from 'fp-ts/lib/pipeable';

import { ReduxStore } from '../rootReducer';
import { LocalSessionWithId, Normalized, LocalGameSession, ID } from '../../model/Session';
import { SessionPlayer, SessionPlayerWithId } from '../../model/Player';
import { MIN_ROOM_SIZE } from '../../api/db/preGameSession';
import { Card } from '../../model/Card';
import { PlayerActions, initialPlayerActions } from './helpers/types';
import { Play, PlayWithId } from '../../model/Play';
import { getPlayerValue } from '../playerHand/selector';

export const getSession = (state: ReduxStore): O.Option<LocalSessionWithId> => state.session;

export const getSessionValue = (state: ReduxStore): LocalSessionWithId => {
  if (O.isNone(state.session))
    throw new Error("Get Session Value can only be used when there's a session");

  return state.session.value;
};

export const getStartedSession = (state: ReduxStore): LocalGameSession & ID => {
  const session = getSessionValue(state);

  if (session.status === 'STARTED') {
    return session;
  }
  throw new Error('Session Not started');
};

export const getCurrentSessionPlayer = (state: ReduxStore): O.Option<SessionPlayer> =>
  pipe(
    state.player,
    O.chain(player =>
      pipe(
        state.session,
        O.fold(
          () => O.none,
          session => R.lookup(player.id, session.players),
        ),
      ),
    ),
  );

export const allPlayersReady = (state: ReduxStore): boolean => {
  if (O.isNone(state.session)) throw new Error('Cannot check players without session.');

  if (R.size(state.session.value.players) < MIN_ROOM_SIZE) return false;
  return pipe(
    state.session.value.players,
    R.filter(player => player.status !== 'ADMIN'),
    R.every(player => player.status === 'READY'),
  );
};

export const getAllPlayers = (state: ReduxStore): Normalized<SessionPlayer> =>
  pipe(
    state.session,
    O.fold(
      () => ({}),
      session => session.players,
    ),
  );

export const ordPlayersByPosition: Ord<SessionPlayerWithId> = pipe(
  ordNumber,
  contramap(player => player.position),
);

export const getOrderedPlayers = (state: ReduxStore): SessionPlayerWithId[] =>
  pipe(
    state.session,
    O.fold(
      () => [],
      session =>
        pipe(
          R.toArray(session.players),
          A.map<[string, SessionPlayer], SessionPlayerWithId>(([id, player]) => ({
            id,
            ...player,
          })),
          A.sort(ordPlayersByPosition),
        ),
    ),
  );

export const getPlays = (state: ReduxStore): Play[] => {
  if (O.isNone(state.session)) throw new Error('Cannot get plays without session.');
  const { status } = state.session.value;
  if (status === 'INITIAL' || status === 'STARTING') return [];

  return Object.values((state.session.value as LocalGameSession).progression);
};

export const getOtherSessionPlayers = (state: ReduxStore): Normalized<SessionPlayer> => {
  const playerId = O.isSome(state.player) ? state.player.value.id : '';
  if (O.isNone(state.session)) throw new Error('Cannot check players without session.');

  return pipe(
    state.session.value.players,
    R.filterWithIndex(key => key !== playerId),
  );
};

export const getCurrentCard = (state: ReduxStore): O.Option<Card> =>
  pipe(
    state.session,
    O.fold(
      () => O.none,
      session => (session.status === 'STARTED' ? O.fromNullable(session.currentCard) : O.none),
    ),
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
    session.progression,
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
