import { random } from 'faker';

import { Card } from './Card';
import { ID, Normalized } from './Session';

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

export type Player = {
  id: string;
  hand: Normalized<Card>;
};
