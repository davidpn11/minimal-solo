import { random } from 'faker';

import { Card } from './Card';
import { ID, Normalized } from './Session';

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
  id: string;
  position: number;
  hand: Normalized<Card>;
};
