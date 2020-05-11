import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { ReduxStore } from '../rootReducer';
import { Player, SessionPlayer } from '../../model/Player';
import * as R from 'fp-ts/lib/Record';
import { getUniqueId } from '../../api/firebase';

export const getPlayer = (state: ReduxStore): Player => state.player;

export const getPlayerId = (state: ReduxStore): string =>
  pipe(
    state.player.id,
    O.fold(
      () => getUniqueId(),
      playerId => playerId,
    ),
  );

export const isCurrentPlayerAdmin = (state: ReduxStore): boolean =>
  pipe(
    state.player.id,
    O.fold(
      () => false,
      playerId =>
        pipe(
          state.session,
          O.fold(
            () => false,
            session => playerId === session.admin,
          ),
        ),
    ),
  );

export const getPlayerHandIds = (state: ReduxStore) => {
  const lookHand = (playerId: string) =>
    pipe(
      state.session,
      O.fold(
        () => {
          throw new Error('Cannot get the player hand without a session');
        },
        session =>
          pipe(
            R.lookup(playerId, session.players),
            O.fold(
              () => [],
              (p: SessionPlayer) => p.hand,
            ),
          ),
      ),
    );
  return pipe(
    state.player.id,
    O.fold(() => [], lookHand),
  );
};
