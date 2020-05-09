import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

import { ReduxStore } from '../rootReducer';
import { Player } from '../../model/Player';
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
      playerId => playerId === state.session.admin,
    ),
  );
