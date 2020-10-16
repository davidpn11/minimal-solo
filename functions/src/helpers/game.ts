import * as A from "fp-ts/lib/Array";
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

function buildCommon(color: string) {
  return commonValues.map((value) => ({
    color,
    value,
    createdAt: 0,
    status: "DECK",
  }));
}

function buildSpecial() {
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
}

export function buildOne() {
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

export function sortDeck<L>(deck: L[]): L[] {
  return deck.sort(() => Math.random() - 0.5);
}
