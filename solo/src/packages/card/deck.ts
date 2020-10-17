import { pipe } from "fp-ts/pipeable";
import * as A from "fp-ts/Array";

const colors: CardColor[] = ["GREEN", "GOLD", "RED", "BLUE", "BLACK"];
const commonValues: CommonCardValue[] = [
  "ONE",
  "TWO",
  "THREE",
  "FOUR",
  "FIVE",
  "SIX",
  "SEVEN",
  "EIGHT",
  "NINE",
];

const actionValues: ActionCardValue[] = [
  "BLOCK",
  "REVERSE",
  "PLUS_TWO",
  "SWAP",
];

function buildCommonCards(color: CommonActionCardColor): CommonCard[] {
  return commonValues.map((value) => ({
    color,
    value,
    createdAt: Date.now(),
    status: "DECK",
    type: "COMMON",
  }));
}

function buildActionCards(color: CommonActionCardColor): ActionCard[] {
  return actionValues.map((value) => ({
    color,
    value,
    createdAt: Date.now(),
    status: "DECK",
    type: "ACTION",
  }));
}

function buildSpecialCards(): SpecialCard[] {
  return [
    {
      color: "BLACK",
      value: "SWAP_ALL",
      createdAt: Date.now(),
      status: "DECK",
      type: "SPECIAL",
    },
    {
      color: "BLACK",
      value: "PLUS_FOUR",
      createdAt: Date.now(),
      status: "DECK",
      type: "SPECIAL",
    },
  ];
}

export function buildDeck(source = colors) {
  return pipe(
    [...source],
    A.map((color) => {
      if (color === "BLACK") {
        return pipe(A.range(1, 4), A.map(buildSpecialCards), A.flatten);
      }
      return A.flatten<Card>([
        buildCommonCards(color),
        buildActionCards(color),
      ]);
    }),
    A.flatten
  );
}

export function sortDeck(deck: Card[]): Card[] {
  return deck.sort(() => Math.random() - 0.5);
}
