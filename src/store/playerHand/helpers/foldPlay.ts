import {
  PassPlay,
  UnoPlay,
  DrawPlay,
  NumberCardPlay,
  PlusTwoPlay,
  BlockPlay,
  ReversePlay,
  SwapPlay,
  SwapAllPlay,
  ColorPlay,
  PlusFourPlay,
  PlayWithId,
  Play,
} from '../../../model/Play';
import { ID } from '../../../model/Session';

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
  if (play.type === 'PASS_PLAY') whenPassPlay(play);
  if (play.type === 'NUMBER_CARD_PLAY') whenNumberCardPlay(play);
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
    case 'PASS_PLAY':
      if (whenPassPlay) whenPassPlay(play);
      break;
    case 'UNO_PLAY':
      if (whenUnoPlay) whenUnoPlay(play);
      break;
    case 'DRAW_PLAY':
      if (whenDrawPlay) whenDrawPlay(play);
      break;
    case 'NUMBER_CARD_PLAY':
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
