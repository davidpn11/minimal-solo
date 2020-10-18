export const isCardPlay = (play: Play): play is NumberCardPlay => play.type === 'NUMBER_CARD_PLAY';
export const isCardDraw = (play: Play): play is DrawPlay => play.type === 'DRAW_PLAY';
export const isAction = (play: Play) =>
  play.type === 'BLOCK_PLAY' ||
  play.type === 'PLUS_FOUR_PLAY' ||
  play.type === 'PLUS_TWO_PLAY' ||
  play.type === 'SWAP_PLAY';
export const isPass = (play: Play): play is PassPlay => play.type === 'PASS_PLAY';
export const isUno = (play: Play): play is UnoPlay => play.type === 'UNO_PLAY';

export function createPassPlay(player: SessionPlayerWithId, position: number): Play {
  return {
    player,
    type: 'PASS_PLAY',
    position,
  };
}

export function createCommonNumberPlay(
  player: SessionPlayerWithId,
  card: CardWithId,
  position: number,
): NumberCardPlay {
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
export function createReversePlay(
  player: SessionPlayerWithId,
  card: CardWithId,
  direction: GameDirection,
  position: number,
): ReversePlay {
  return {
    type: 'REVERSE_PLAY',
    card,
    direction,
    player,
    position,
  };
}

export function createDrawPlay(
  player: SessionPlayerWithId,
  card: CardWithId,
  position: number,
): DrawPlay {
  return {
    player,
    type: 'DRAW_PLAY',
    card: card,
    position,
  };
}

export function createPlusTwoPlay(
  player: SessionPlayerWithId,
  card: CardWithId,
  target: SessionPlayerWithId,
  position: number,
): PlusTwoPlay {
  return {
    player,
    type: 'PLUS_TWO_PLAY',
    card,
    position,
    target,
  };
}

export function createSwapPlay(
  player: SessionPlayerWithId,
  card: CardWithId,
  target: SessionPlayerWithId,
  position: number,
): SwapPlay {
  return {
    player,
    type: 'SWAP_PLAY',
    card,
    position,
    target,
  };
}
export function createSwapAllPlay(
  player: SessionPlayerWithId,
  card: SpecialCard,
  position: number,
): SwapAllPlay {
  return {
    player,
    type: 'SWAP_ALL_PLAY',
    card,
    position,
  };
}

export function createColorPlay(
  player: SessionPlayerWithId,
  card: CardWithId,
  color: CardColor,
  position: number,
): ColorPlay {
  return {
    player,
    type: 'COLOR_PLAY',
    color,
    card,
    position,
  };
}

export function createPlusFourPlay(
  player: SessionPlayerWithId,
  card: SpecialCard,
  target: SessionPlayerWithId,
  position: number,
): PlusFourPlay {
  return {
    player,
    type: 'PLUS_FOUR_PLAY',
    card,
    position,
    target,
  };
}

export function createUnoPlay(player: SessionPlayerWithId, position: number): UnoPlay {
  return {
    player,
    type: 'UNO_PLAY',
    position,
  };
}
