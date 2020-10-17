import { pipe } from 'fp-ts/lib/pipeable';

import {
  Play,
  BlockPlay,
  PlusFourPlay,
  PlusTwoPlay,
  SwapPlay,
  NumberCardPlay,
  SwapAllPlay,
  ReversePlay,
  ColorPlay,
} from '../../../model/Play';
import { GameDirection } from '../../../model/Session';
import { getOrThrow } from '../../../store/session/helpers/foldSession';
import { foldPlay } from '../../../store/playerHand/helpers/foldPlay';

type Story = string;

function mapCardValue(value: CardValue): string {
  switch (value) {
    case 'NINE':
      return '9';
    case 'EIGHT':
      return '8';
    case 'SEVEN':
      return '7';
    case 'SIX':
      return '6';
    case 'FIVE':
      return '5';
    case 'FOUR':
      return '4';
    case 'THREE':
      return '3';
    case 'TWO':
      return '2';
    case 'ONE':
      return '1';
    case 'PLUS_TWO':
      return '+2';
    case 'PLUS_FOUR':
      return '+4';
    case 'BLOCK':
      return 'Block';
    case 'COLOR':
      return 'Color';
    case 'REVERSE':
      return 'Reverse';
    case 'SWAP':
      return 'Swap';
    case 'SWAP_ALL':
      return 'Swap All';
    default:
      return '';
  }
}

function mapColorValue(color: CardColor): string {
  switch (color) {
    case 'GOLD':
      return 'gold';
    case 'BLUE':
      return 'blue';
    case 'RED':
      return 'red';
    case 'GREEN':
      return 'green';

    default:
      throw new Error('Invalid color (probably black)');
  }
}

function mapGameDirection(direction: GameDirection): string {
  switch (direction) {
    case 'LEFT':
      return 'left';
    case 'RIGHT':
      return 'right';
    default:
      throw new Error('Invalid direction');
  }
}

function mapCardPlayToStory(play: NumberCardPlay): Story {
  const { color, value } = play.card;
  const mappedValue = mapCardValue(value);

  return `Played a ${color} ${mappedValue} card.`;
}

function mapGameActionToStory(play: SwapAllPlay | ColorPlay | ReversePlay): Story {
  switch (play.type) {
    case 'SWAP_ALL_PLAY':
      return 'Swapped all the cards around.';
    case 'COLOR_PLAY':
      return `Played a color card and chose the color ${mapColorValue(play.color)}`;
    case 'REVERSE_PLAY':
      return `Reversed the game direction to ${mapGameDirection(play.direction)}.`;
    default:
      throw new Error('Impossible state while mapping action to story.');
  }
}

function mapTargetActionToStory(play: BlockPlay | PlusFourPlay | PlusTwoPlay | SwapPlay): Story {
  switch (play.type) {
    case 'BLOCK_PLAY':
      return `Blocked ${play.target.name} with a ${play.card.color} card.`;
    case 'PLUS_FOUR_PLAY':
      return `Applied a +4 to ${play.target.name}.`;
    case 'PLUS_TWO_PLAY':
      return `Applied a +2 to ${play.target.name} with a ${play.card.color} play.card.`;
    case 'SWAP_PLAY':
      return `Swapped hands with ${play.target.name} with a ${play.card.color} card.`;
  }
}

export function tellThisPlayStory(play: Play): Story {
  return pipe(
    play,
    foldPlay({
      whenDrawPlay: () => 'Drew a card.',
      whenPassPlay: () => 'Passed his turn.',
      whenUnoPlay: () => 'Called Uno',
      whenSwapAllPlay: mapGameActionToStory,
      whenColorPlay: mapGameActionToStory,
      whenReversePlay: mapGameActionToStory,
      whenBlockPlay: mapTargetActionToStory,
      whenPlusFourPlay: mapTargetActionToStory,
      whenPlusTwoPlay: mapTargetActionToStory,
      whenSwapPlay: mapTargetActionToStory,
      whenNumberCardPlay: mapCardPlayToStory,
    }),
    getOrThrow,
  );
}
