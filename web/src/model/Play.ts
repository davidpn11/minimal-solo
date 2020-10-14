import { SessionPlayer, SessionPlayerWithId } from './Player';
import * as O from 'fp-ts/lib/Option';
import { Card, CommonCard } from './Card';
import { ID } from './Session';

export type Play = {
  player: SessionPlayerWithId;
  type: 'PLAY_CARD' | 'DRAW_CARD' | 'ACTION' | 'PASS';
  card: O.Option<Card>;
  target: O.Option<SessionPlayer>;
  position: number;
};

export type PlayWithId = Play & ID;
export type PassPlay = Play & {
  type: 'PASS';
  card: typeof O.none;
  target: typeof O.none;
};
export type CommonNumberCardPlay = PlayWithId & {
  type: 'PLAY_CARD';
  card: O.Some<CommonCard>;
  target: typeof O.none;
};

export const isCardPlay = (play: Play): play is CommonNumberCardPlay => play.type === 'PLAY_CARD';
export const isCardDraw = (play: Play) => play.type === 'DRAW_CARD';
export const isAction = (play: Play) => play.type === 'ACTION';
export const isPass = (play: Play): play is PassPlay => play.type === 'PASS';

export function createPassPlay(player: SessionPlayerWithId, position: number): PassPlay {
  return {
    player,
    type: 'PASS',
    card: O.none,
    target: O.none,
    position,
  };
}

export function createCommonNumberPlay(
  player: SessionPlayerWithId,
  card: CommonCard,
  position: number,
): Play {
  return {
    player,
    type: 'PLAY_CARD',
    card: O.some(card),
    target: O.none,
    position,
  };
}
