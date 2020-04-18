import * as A from "fp-ts/lib/Array";

export type Color = "GREEN" | "GOLD" | "RED" | "BLUE" | "BLACK";
type Value =
  | "ONE"
  | "TWO"
  | "THREE"
  | "FOUR"
  | "FIVE"
  | "ZERO"
  | "SIX"
  | "SEVEN"
  | "EIGHT"
  | "NINE"
  | "BLOCK"
  | "REVERSE"
  | "PLUS_TWO"
  | "SWAP"
  | "PLUS_FOUR"
  | "SWAP_ALL";

type CommonCard = {
  color: Omit<Color, "BLACK">;
  value: Omit<Value, "PLUS_FOR" | "SWAP_ALL">;
  createdAt: number;
  status: Status;
};

type ActionCard = {
  color: "BLACK";
  value: "PLUS_FOUR" | "SWAP_ALL";
  createdAt: number;
  status: Status;
};

const colors: Color[] = ["GREEN", "GOLD", "RED", "BLUE", "BLACK"];
const commonValues: Value[] = [
  "ONE",
  "TWO",
  "THREE",
  "FOUR",
  "FIVE",
  "ZERO",
  "SIX",
  "SEVEN",
  "EIGHT",
  "NINE",
  "BLOCK",
  "REVERSE",
  "PLUS_TWO",
  "SWAP",
];

type Card = CommonCard | ActionCard;

type Status = "HAND" | "DECK" | "GAME" | "PLAY";

type Deck = Card[];

function buildCommon(color: Color): CommonCard[] {
  return commonValues.map((value) => {
    return {
      color,
      value,
      createdAt: 0,
      status: "DECK",
    };
  });
}

const buildSpecial = (): ActionCard[] => {
  return [
    {
      color: "BLACK",
      value: "SWAP_ALL",
      createdAt: 0,
      status: "DECK",
    },
    {
      color: "BLACK",
      value: "PLUS_FOUR",
      createdAt: 0,
      status: "DECK",
    },
  ];
};

export function buildOne(): Deck {
  const cs = colors.map((c) => {
    if (c === "BLACK") {
      return [
        ...buildSpecial(),
        ...buildSpecial(),
        ...buildSpecial(),
        ...buildSpecial(),
      ];
    } else {
      return buildCommon(c);
    }
  });
  return A.flatten(cs);
}
