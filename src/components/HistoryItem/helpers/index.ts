import * as O from 'fp-ts/lib/Option';
import { Play } from '../../../model/Session';
import { Value } from '../../../model/Card';
import { pipe } from 'fp-ts/lib/pipeable';
import { SessionPlayer } from '../../../model/Player';

type Story = string;

const isCardPlay = (play: Play) => play.type === 'PLAY_CARD';
const isCardDraw = (play: Play) => play.type === 'DRAW_CARD';
const isAction = (play: Play) => play.type === 'ACTION';

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

function mapGameActionToStory(play: Play): () => Story {
  return () => {
    if (O.isNone(play.card))
      throw new Error('Impossible state while mapping game action to story.');
    const card = play.card.value;

    switch (card.value) {
      case 'SWAP_ALL':
        return 'Swapped all the cards around.';
      case 'COLOR':
        return 'Played a color card and chose a color.';
      case 'REVERSE':
        return `Reversed the game direction with a ${card.color} card.`;
      default:
        throw new Error('Impossible state while mapping action to story.');
    }
  };
}

function mapTargetActionToStory(play: Play): (target: SessionPlayer) => Story {
  return target => {
    if (O.isNone(play.card))
      throw new Error('Impossible state while mapping target action to story.');
    const card = play.card.value;

    switch (card.value) {
      case 'BLOCK':
        return `Blocked ${target.name} with a ${card.color} card.`;
      case 'PLUS_FOUR':
        return `Applied a +4 to ${target.name}.`;
      case 'PLUS_TWO':
        return `Applied a +2 to ${target.name} with a ${card.color} card.`;
      case 'SWAP':
        return `Swapped hands with ${target.name} with a ${card.color} card.`;
    }

    return '';
  };
}

function mapActionToStory(play: Play): Story {
  if (O.isNone(play.card)) throw new Error('Impossible state while mapping action to story.');

  return pipe(play.target, O.fold(mapGameActionToStory(play), mapTargetActionToStory(play)));
}

export function tellThisPlayStory(play: Play): Story {
  if (isCardDraw(play)) return 'Drew a card.';
  if (isCardPlay(play)) return mapCardPlayToStory(play);
  if (isAction(play)) return mapActionToStory(play);
  throw new Error('Impossible state while trying to tell a story.');
}
