declare type PassPlay = {
  type: "PASS_PLAY";
  player: SessionPlayerWithId;
  position: number;
};

declare type UnoPlay = {
  type: "UNO_PLAY";
  player: SessionPlayerWithId;
  position: number;
};

declare type DrawPlay = {
  type: "DRAW_PLAY";
  player: SessionPlayerWithId;
  position: number;
};

declare type NumberCardPlay = {
  type: "NUMBER_CARD_PLAY";
  card: Card;
  player: SessionPlayerWithId;
  position: number;
};

declare type PlusTwoPlay = {
  type: "PLUS_TWO_PLAY";
  card: Card;
  target: SessionPlayerWithId;
  player: SessionPlayerWithId;
  position: number;
};

declare type BlockPlay = {
  type: "BLOCK_PLAY";
  card: Card;
  target: SessionPlayerWithId;
  player: SessionPlayerWithId;
  position: number;
};

declare type ReversePlay = {
  type: "REVERSE_PLAY";
  card: Card;
  direction: GameDirection;
  player: SessionPlayerWithId;
  position: number;
};

declare type SwapPlay = {
  type: "SWAP_PLAY";
  card: Card;
  target: SessionPlayerWithId;
  player: SessionPlayerWithId;
  position: number;
};

declare type SwapAllPlay = {
  type: "SWAP_ALL_PLAY";
  card: Card;
  player: SessionPlayerWithId;
  position: number;
};

declare type ColorPlay = {
  type: "COLOR_PLAY";
  card: Card;
  color: CardColor;
  player: SessionPlayerWithId;
  position: number;
};

declare type PlusFourPlay = {
  type: "PLUS_FOUR_PLAY";
  card: Card;
  target: SessionPlayerWithId;
  player: SessionPlayerWithId;
  position: number;
};

declare type Play =
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

declare type PlayWithId = Play & ID;
