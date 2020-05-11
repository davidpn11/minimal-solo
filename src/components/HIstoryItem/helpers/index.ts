import * as O from 'fp-ts/lib/Option';
import { Play } from '../../../model/Session';
import { Value } from '../../../model/Card';

type Story = string;

function isCardPlay(play: Play) {
  return play.type === 'PLAY_CARD';
}

function mapCardValue(value: Value): string {
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

function mapCardPlayToStory(play: Play): Story {
  if (O.isNone(play.card)) throw new Error('Impossible state while mapping card to story.');

  const { color, value } = play.card.value;
  const mappedValue = mapCardValue(value);

  return `Played a ${color} ${mappedValue} card.`;
}

function isCardDraw(play: Play) {
  return play.type === 'DRAW_CARD';
}

export function tellThisPlayStory(play: Play): Story {
  if (isCardDraw(play)) return 'Drew a card.';
  if (isCardPlay(play)) return mapCardPlayToStory(play);
  return '';
}
