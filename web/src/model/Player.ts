import { pipe } from 'fp-ts/lib/pipeable';
import * as R from 'fp-ts/lib/Record';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';

import { Normalized } from './Session';

export function getSessionPlayerByPosition(
  players: Normalized<SessionPlayer>,
  position: number,
): SessionPlayerWithId {
  return pipe(
    players,
    R.toArray,
    A.map(([id, player]) => ({ id, ...player })),
    A.findFirst(player => player.position === position),
    O.fold(
      () => {
        throw new Error('No player matches the next position.');
      },
      player => player,
    ),
  );
}
