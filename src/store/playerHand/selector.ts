import { ReduxStore } from '../rootReducer';
import { Player, SessionPlayer } from '../../model/Player';
import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';
import * as R from 'fp-ts/lib/Record';

export const getPlayer = (state: ReduxStore): Player => state.player;

export const getPlayerId = (state: ReduxStore): string => state.player.id;

export const isCurrentPlayerAdmin = (state: ReduxStore): boolean =>
  state.player.id === state.session.admin;

export const getPlayerHandIds = (state: ReduxStore) => {
  return pipe(
    R.lookup(state.player.id, state.session.players),
    O.fold(
      () => [],
      (p: SessionPlayer) => p.hand,
    ),
  );
};
