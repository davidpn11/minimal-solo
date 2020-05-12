import * as O from 'fp-ts/lib/Option';
import * as R from 'fp-ts/lib/Record';
import { ReduxStore } from '../rootReducer';
import { LocalSessionWithId, Normalized, Play } from '../../model/Session';
import { SessionPlayer } from '../../model/Player';
import { pipe } from 'fp-ts/lib/pipeable';
import { MIN_ROOM_SIZE } from '../../api/db/preGameSession';
import { Card } from '../../model/Card';

export const getSession = (state: ReduxStore): O.Option<LocalSessionWithId> => state.session;

export const getSessionValue = (state: ReduxStore): LocalSessionWithId => {
  if (O.isNone(state.session))
    throw new Error("Get Session Value can only be used when there's a session");

  return state.session.value;
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

export const getPlays = (state: ReduxStore): Play[] => {
  if (O.isNone(state.session)) throw new Error('Cannot get plays without session.');
  if (state.session.value.status === 'INITIAL') return [];
  return Object.values(state.session.value.progression);
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
