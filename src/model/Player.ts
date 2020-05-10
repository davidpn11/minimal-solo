import * as O from 'fp-ts/lib/Option';
import { random } from 'faker';
import { ID, Normalized } from './Session';
import { Card } from './Card';

export function createAvatar(): PlayerAvatar {
  return {
    positionX: random.number({ min: -1000, max: 700 }),
    positionY: random.number({ min: -1000, max: 700 }),
    scale: random.number({ min: 10, max: 50 }),
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
  avatar: PlayerAvatar;
  status: PlayerStatus;
};

export type SessionPlayerWithId = SessionPlayer & ID;

export type Player = {
  id: O.Option<string>;
  hand: Normalized<Card>;
};
