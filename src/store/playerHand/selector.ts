import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { ReduxStore } from '../rootReducer';
import { Player, SessionPlayer } from '../../model/Player';
import * as R from 'fp-ts/lib/Record';
import { getUniqueId } from '../../api/firebase';

export const getPlayer = (state: ReduxStore): O.Option<Player> => state.player;

export const getPlayerValue = (state: ReduxStore): Player => {
  if (O.isNone(state.player)) throw new Error('Cannot get player value when there is no player.');

  return state.player.value;
};

export const getPlayerId = (state: ReduxStore): string =>
  pipe(
    state.player,
    O.fold(
      () => getUniqueId(),
      player => player.id,
    ),
  );

export const isCurrentPlayerAdmin = (state: ReduxStore): boolean =>
  pipe(
    state.player,
    O.fold(
      () => false,
      player =>
        pipe(
          state.session,
          O.fold(
            () => false,
            session => player.id === session.admin,
          ),
        ),
    ),
  );

export const getPlayerHandIds = (state: ReduxStore) => {
  const lookHand = (player: Player) =>
    pipe(
      state.session,
      O.fold(
        () => {
          throw new Error('Cannot get the player hand without a session');
        },
        session =>
          pipe(
            R.lookup(player.id, session.players),
            O.fold(
              () => [],
              (p: SessionPlayer) => p.hand,
            ),
          ),
      ),
    );

  return pipe(
    state.player,
    O.fold(() => [], lookHand),
  );
};
