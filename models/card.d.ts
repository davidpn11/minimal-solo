declare type CardColor = "GREEN" | "GOLD" | "RED" | "BLUE" | "BLACK";
declare type CardValue =
  | "ONE"
  | "TWO"
  | "THREE"
  | "FOUR"
  | "FIVE"
  | "SIX"
  | "SEVEN"
  | "EIGHT"
  | "NINE"
  | "BLOCK"
  | "REVERSE"
  | "PLUS_TWO"
  | "PLUS_FOUR"
  | "SWAP"
  | "SWAP_ALL"
  | "COLOR";

declare type CardStatus = "HAND" | "DECK" | "GAME" | "PLAY";

declare type CommonCard = {
  color: Exclude<CardColor, "BLACK">;
  value: Exclude<CardValue, "PLUS_FOUR" | "SWAP_ALL">;
  createdAt: number;
  status: CardStatus;
};
declare type CommonCardWithId = CommonCard & { id: string };

declare type ActionCard = {
  color: "BLACK";
  value: "PLUS_FOUR" | "SWAP_ALL" | "COLOR";
  createdAt: number;
  status: CardStatus;
};

declare type Card = CommonCard | ActionCard;
