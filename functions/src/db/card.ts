import * as io from "io-ts";
import { DateFromNumber } from "io-ts-types";

const CardColorEnum = io.keyof({
  GREEN: "",
  GOLD: "",
  RED: "",
  BLUE: "",
  BLACK: "",
});

const CardStatusEnum = io.keyof({
  HAND: "",
  DECK: "",
  GAME: "",
  PLAY: "",
});

const CardValueEnum = io.keyof({
  ONE: "",
  TWO: "",
  THREE: "",
  FOUR: "",
  FIVE: "",
  SIX: "",
  SEVEN: "",
  EIGHT: "",
  NINE: "",
  BLOCK: "",
  REVERSE: "",
  PLUS_TWO: "",
  PLUS_FOUR: "",
  SWAP: "",
  SWAP_ALL: "",
  COLOR: "",
});

export const CardSchema = io.type({
  color: CardColorEnum,
  createdAt: DateFromNumber,
  status: CardStatusEnum,
  value: CardValueEnum,
});
