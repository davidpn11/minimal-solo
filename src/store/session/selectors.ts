import * as O from 'fp-ts/lib/Option';
import * as R from 'fp-ts/lib/Record';
import { ReduxStore } from '../rootReducer';
import { LocalSessionWithId, Normalized, Play } from '../../model/Session';
import { SessionPlayer } from '../../model/Player';
import { pipe } from 'fp-ts/lib/pipeable';
import { MIN_ROOM_SIZE } from '../../api/db/preGameSession';
import { Card } from '../../model/Card';

export const getSession = (state: ReduxStore): LocalSessionWithId => state.session;

export const getCurrentSessionPlayer = (state: ReduxStore): O.Option<SessionPlayer> =>
  pipe(
    state.player.id,
    O.chain(playerId => R.lookup(playerId, state.session.players)),
  );

export const allPlayersReady = (state: ReduxStore): boolean => {
  if (R.size(state.session.players) < MIN_ROOM_SIZE) return false;
  return pipe(
    state.session.players,
    R.filter(player => player.status !== 'ADMIN'),
    R.every(player => player.status === 'READY'),
  );
};

export const getAllPlayers = (state: ReduxStore): Normalized<SessionPlayer> =>
  state.session.players;

export const getPlays = (state: ReduxStore): Play[] => {
  if (state.session.status === 'INITIAL') return [];
  return [];
  // return Object.values(state.session.progression);
};

export const getOtherSessionPlayers = (state: ReduxStore): Normalized<SessionPlayer> => {
  const playerId = O.isSome(state.player.id) ? state.player.id.value : '';

  return pipe(
    state.session.players,
    R.filterWithIndex(key => key !== playerId),
  );
};

export const getCurrentCard = (state: ReduxStore): O.Option<Card> =>
  state.session.status === 'STARTED' ? O.fromNullable(state.session.currentCard) : O.none;
