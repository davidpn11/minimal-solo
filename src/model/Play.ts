import { SessionPlayerWithId } from './Player';
import { Card, CommonCard, Color, CardWithId } from './Card';
import { ID, GameDirection } from './Session';

export type PassPlay = {
  type: 'PASS_PLAY';
  player: SessionPlayerWithId;
  position: number;
};

export type UnoPlay = {
  type: 'UNO_PLAY';
  player: SessionPlayerWithId;
  position: number;
};
export type DrawPlay = {
  type: 'DRAW_PLAY';
  card: Card;
  player: SessionPlayerWithId;
  position: number;
};

export type NumberCardPlay = {
  type: 'NUMBER_CARD_PLAY';
  card: Card;
  player: SessionPlayerWithId;
  position: number;
};

export type PlusTwoPlay = {
  type: 'PLUS_TWO_PLAY';
  card: Card;
  target: SessionPlayerWithId;
  player: SessionPlayerWithId;
  position: number;
};

export type BlockPlay = {
  type: 'BLOCK_PLAY';
  card: Card;
  target: SessionPlayerWithId;
  player: SessionPlayerWithId;
  position: number;
};

export type ReversePlay = {
  type: 'REVERSE_PLAY';
  card: Card;
  direction: GameDirection;
  player: SessionPlayerWithId;
  position: number;
};

export type SwapPlay = {
  type: 'SWAP_PLAY';
  card: Card;
  target: SessionPlayerWithId;
  player: SessionPlayerWithId;
  position: number;
};

export type SwapAllPlay = {
  type: 'SWAP_ALL_PLAY';
  card: Card;
  player: SessionPlayerWithId;
  position: number;
};

export type ColorPlay = {
  type: 'COLOR_PLAY';
  card: Card;
  color: Color;
  player: SessionPlayerWithId;
  position: number;
};

export type PlusFourPlay = {
  type: 'PLUS_FOUR_PLAY';
  card: Card;
  target: SessionPlayerWithId;
  player: SessionPlayerWithId;
  position: number;
};

export type Play =
  | PassPlay
  | UnoPlay
  | DrawPlay
  | NumberCardPlay
  | PlusTwoPlay
  | BlockPlay
  | ReversePlay
  | SwapPlay
  | SwapAllPlay
  | ColorPlay
  | PlusFourPlay;

export type PlayWithId = Play & ID;

export const isCardPlay = (play: Play) => play.type === 'NUMBER_CARD_PLAY';
export const isCardDraw = (play: Play) => play.type === 'DRAW_PLAY';
export const isAction = (play: Play) =>
  play.type === 'BLOCK_PLAY' ||
  play.type === 'PLUS_FOUR_PLAY' ||
  play.type === 'PLUS_TWO_PLAY' ||
  play.type === 'SWAP_PLAY';
export const isPass = (play: Play) => play.type === 'PASS_PLAY';
export const isUno = (play: Play) => play.type === 'UNO_PLAY';

export function createPassPlay(player: SessionPlayerWithId, position: number): Play {
  return {
    player,
    type: 'PASS_PLAY',
    position,
  };
}

export function createCommonNumberPlay(
  player: SessionPlayerWithId,
  card: CommonCard,
  position: number,
): Play {
  return {
    type: 'NUMBER_CARD_PLAY',
    player,
    card,
    position,
  };
}

export function createBlockPlay(
  player: SessionPlayerWithId,
  nextPlayer: SessionPlayerWithId,
  card: CardWithId,
  position: number,
): BlockPlay {
  return {
    type: 'BLOCK_PLAY',
    player,
    card,
    position,
    target: nextPlayer,
  };
}
