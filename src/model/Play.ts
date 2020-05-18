import { SessionPlayer } from './Player';
import * as O from 'fp-ts/lib/Option';
import { Card } from './Card';

export type Play = {
  player: SessionPlayer;
  type: 'PLAY_CARD' | 'DRAW_CARD' | 'ACTION' | 'PASS';
  card: O.Option<Card>;
  target: O.Option<SessionPlayer>;
  position: number;
};

export function createPassPlay(player: SessionPlayer, position: number): Play {
  return {
    player,
    type: 'PASS',
    card: O.none,
    target: O.none,
    position,
  };
}
