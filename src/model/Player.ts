import { ID, Normalized } from './Session';
import { Card } from './Card';

export type PlayerStatus = 'READY' | 'NOT_READY' | 'ADMIN';
export type SessionPlayer = {
  name: string;
  hand: string[];
  status: PlayerStatus;
};

export type SessionPlayerWithId = SessionPlayer & ID;

export type Player = {
  id: string;
  hand: Normalized<Card>;
};
