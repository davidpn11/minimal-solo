import * as io from "io-ts";

export const PlayerAvatarSchema = io.type({
  positionX: io.number,
  positionY: io.number,
  scale: io.number,
});
export const PlayerStatusEnum = io.keyof({
  READY: "",
  NOT_READY: "",
  ADMIN: "",
});
const Schema = {
  name: io.string,
  hand: io.array(io.string),
  position: io.number,
  avatar: PlayerAvatarSchema,
  status: PlayerStatusEnum,
};
export const SessionPlayerSchema = io.type(Schema);
export const SessionPlayerWithIdSchema = io.type({ ...Schema, id: io.string });
