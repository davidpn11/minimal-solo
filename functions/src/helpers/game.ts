import * as A from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";
import { random } from "faker";

export function createAvatar() {
  return {
    positionX: random.number({ min: -1400, max: -10 }),
    positionY: random.number({ min: -1000, max: -10 }),
    scale: random.number({ min: 5000, max: 5500 }),
  };
}

const colors = ["GREEN", "GOLD", "RED", "BLUE", "BLACK"] as const;
const commonValues = [
  "ONE",
  "TWO",
  "THREE",
  "FOUR",
  "FIVE",
  "SIX",
  "SEVEN",
  "EIGHT",
  "NINE",
  "BLOCK",
  "REVERSE",
  "PLUS_TWO",
  "SWAP",
] as const;

function buildCommonCards(color: string) {
  return commonValues.map((value) => ({
    color,
    value,
    createdAt: Date.now(),
    status: "DECK",
  }));
}

function buildSpecialCards() {
  return [
    {
      color: "BLACK",
      value: "SWAP_ALL",
      createdAt: Date.now(),
      status: "DECK",
    },
    {
      color: "BLACK",
      value: "PLUS_FOUR",
      createdAt: Date.now(),
      status: "DECK",
    },
  ];
}

export function buildDeck() {
  const cs = colors.map((c) => {
    if (c === "BLACK") {
      return pipe(
        A.range(1, 4),
        A.map(() => buildSpecialCards()),
        A.flatten
      );
    } else {
      return buildCommonCards(c);
    }
  });

  return A.flatten(cs);
}

export function sortDeck<L>(deck: L[]): L[] {
  return deck.sort(() => Math.random() - 0.5);
}
