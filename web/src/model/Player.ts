import { random } from 'faker';
import { pipe } from 'fp-ts/lib/pipeable';
import * as R from 'fp-ts/lib/Record';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';

import { Card } from './Card';

export function createAvatar(): PlayerAvatar {
  return {
    positionX: random.number({ min: -1400, max: -10 }),
    positionY: random.number({ min: -1000, max: -10 }),
    scale: random.number({ min: 5000, max: 5500 }),
  };
}
export type PlayerAvatar = {
  positionX: number;
  positionY: number;
  scale: number;
};

export type PlayerStatus = 'READY' | 'NOT_READY' | 'ADMIN';
export type SessionPlayer = {
  name: string;
  hand: string[];
  position: number;
  avatar: PlayerAvatar;
  status: PlayerStatus;
};

export type SessionPlayerWithId = SessionPlayer & ID;

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

export type Player = {
  id: string;
  hand: Normalized<Card>;
};
