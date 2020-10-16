import * as io from "io-ts";
import { SessionPlayerWithIdSchema } from "./player";
import { CardSchema } from "./card";

export const PlaySchema = io.type({
  type: io.string,
  card: CardSchema,
  target: SessionPlayerWithIdSchema,
  player: SessionPlayerWithIdSchema,
  position: io.number,
});
