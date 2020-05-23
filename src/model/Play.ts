import { SessionPlayer, SessionPlayerWithId } from './Player';
import * as O from 'fp-ts/lib/Option';
import { Card, CommonCard, Color } from './Card';
import { ID, GameDirection } from './Session';

// export type Play = {
//   player: SessionPlayerWithId;
//   type: 'PLAY_CARD' | 'DRAW_CARD' | 'ACTION' | 'PASS';
//   card: O.Option<Card>;
//   target: O.Option<SessionPlayer>;
//   position: number;
// };

// export type BasePlay = {
//   player: SessionPlayerWithId;
//   position: number;
// };

export type PassPlay = {
  type: 'PASS';
  player: SessionPlayerWithId;
  position: number;
};

export type UnoPlay = {
  type: 'UNO';
  player: SessionPlayerWithId;
  position: number;
};
export type DrawPlay = {
  type: 'DRAW';
  card: Card;
  player: SessionPlayerWithId;
  position: number;
};

export type NumberCardPlay = {
  type: 'PLAY_NUMBER_CARD';
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

const foldPlayDefault = {
  whenPassPlay: () => {
    throw new Error('No PassPlay');
  },
  whenUnoPlay: () => {
    throw new Error('No UnoPlay');
  },
  whenDrawPlay: () => {
    throw new Error('No DrawPlay');
  },
  whenNumberCardPlay: () => {
    throw new Error('No NumberCardPlay');
  },
  whenPlusTwoPlay: () => {
    throw new Error('No PlusTwoPlay');
  },
  whenBlockPlay: () => {
    throw new Error('No BlockPlay');
  },
  whenReversePlay: () => {
    throw new Error('No ReversePlay');
  },
  whenSwapPlay: () => {
    throw new Error('No SwapPlay');
  },
  whenSwapAllPlay: () => {
    throw new Error('No SwapAllPlay');
  },
  whenColorPlay: () => {
    throw new Error('No ColorPlay');
  },
  whenPlusFourPlay: () => {
    throw new Error('No PlusFourPlay');
  },
};

type FoldPlayParams<B = void> = {
  whenPassPlay?: (p: PassPlay) => B | void;
  whenUnoPlay?: (p: UnoPlay) => B | void;
  whenDrawPlay?: (p: DrawPlay) => B | void;
  whenNumberCardPlay?: (p: NumberCardPlay) => B | void;
  whenPlusTwoPlay?: (p: PlusTwoPlay) => B | void;
  whenBlockPlay?: (p: BlockPlay) => B | void;
  whenReversePlay?: (p: ReversePlay) => B | void;
  whenSwapPlay?: (p: SwapPlay) => B | void;
  whenSwapAllPlay?: (p: SwapAllPlay) => B | void;
  whenColorPlay?: (p: ColorPlay) => B | void;
  whenPlusFourPlay?: (p: PlusFourPlay) => B | void;
};

export const foldPlayWithId = (
  whenPassPlay: (p: PassPlay & ID) => void,
  whenNumberCardPlay: (p: NumberCardPlay & ID) => void,
) => (play: PlayWithId) => {
  if (play.type === 'PASS') whenPassPlay(play);
  if (play.type === 'PLAY_NUMBER_CARD') whenNumberCardPlay(play);
};

export const foldPlay = <B>({
  whenPassPlay,
  whenUnoPlay,
  whenDrawPlay,
  whenNumberCardPlay,
  whenPlusTwoPlay,
  whenBlockPlay,
  whenReversePlay,
  whenSwapPlay,
  whenSwapAllPlay,
  whenColorPlay,
  whenPlusFourPlay,
}: FoldPlayParams<B> = foldPlayDefault) => (play: Play): B | void => {
  switch (play.type) {
    case 'PASS':
      if (whenPassPlay) whenPassPlay(play);
      break;
    case 'UNO':
      if (whenUnoPlay) whenUnoPlay(play);
      break;
    case 'DRAW':
      if (whenDrawPlay) whenDrawPlay(play);
      break;
    case 'PLAY_NUMBER_CARD':
      if (whenNumberCardPlay) whenNumberCardPlay(play);
      break;
    case 'PLUS_TWO_PLAY':
      if (whenPlusTwoPlay) whenPlusTwoPlay(play);
      break;
    case 'BLOCK_PLAY':
      if (whenBlockPlay) whenBlockPlay(play);
      break;
    case 'REVERSE_PLAY':
      if (whenReversePlay) whenReversePlay(play);
      break;
    case 'SWAP_PLAY':
      if (whenSwapPlay) whenSwapPlay(play);
      break;
    case 'SWAP_ALL_PLAY':
      if (whenSwapAllPlay) whenSwapAllPlay(play);
      break;
    case 'COLOR_PLAY':
      if (whenColorPlay) whenColorPlay(play);
      break;
    case 'PLUS_FOUR_PLAY':
      if (whenPlusFourPlay) whenPlusFourPlay(play);
      break;
    default:
      throw new Error('Invalid Play type');
  }
};

export const isCardPlay = (play: Play) => play.type === 'PLAY_NUMBER_CARD';
export const isCardDraw = (play: Play) => play.type === 'DRAW';
export const isAction = (play: Play) =>
  play.type === 'BLOCK_PLAY' ||
  play.type === 'PLUS_FOUR_PLAY' ||
  play.type === 'PLUS_TWO_PLAY' ||
  play.type === 'SWAP_PLAY';
export const isPass = (play: Play) => play.type === 'PASS';
export const isUno = (play: Play) => play.type === 'UNO';

export function createPassPlay(player: SessionPlayerWithId, position: number): Play {
  return {
    player,
    type: 'PASS',
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
    type: 'PLAY_NUMBER_CARD',
    card: card,
    position,
  };
}
