type ID = { id: string };

declare type CommonActionCardColor = "GREEN" | "GOLD" | "RED" | "BLUE";
declare type SpecialCardColor = "BLACK";
declare type CardColor = CommonActionCardColor | SpecialCardColor;

declare type CommonCardValue =
  | "ONE"
  | "TWO"
  | "THREE"
  | "FOUR"
  | "FIVE"
  | "SIX"
  | "SEVEN"
  | "EIGHT"
  | "NINE";
declare type ActionCardValue = "BLOCK" | "REVERSE" | "PLUS_TWO" | "SWAP";
declare type SpecialCardValue = "PLUS_FOUR" | "SWAP_ALL" | "COLOR";
declare type CardValue = CommonCardValue | ActionCardValue | SpecialCardValue;

declare type CardType = "COMMON" | "ACTION" | "SPECIAL";

declare type CardStatus = "HAND" | "DECK" | "GAME" | "PLAY";

declare type CommonCard = {
  color: CommonActionCardColor;
  value: CommonCardValue;
  createdAt: number;
  status: CardStatus;
  type: "COMMON";
};
declare type CommonCardWithId = CommonCard & ID;

declare type ActionCard = {
  color: CommonActionCardColor;
  value: ActionCardValue;
  createdAt: number;
  status: CardStatus;
  type: "ACTION";
};
declare type ActionCardWithId = ActionCard & ID;

declare type SpecialCard = {
  color: SpecialCardColor;
  value: SpecialCardValue;
  createdAt: number;
  status: CardStatus;
  type: "SPECIAL";
};
declare type SpecialCardWithId = SpecialCard & ID;

declare type Card = CommonCard | ActionCard | SpecialCard;
declare type CardWithId = Card & ID;
