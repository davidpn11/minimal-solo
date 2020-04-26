import { ID } from "./Session";

export type PlayerStatus = "READY" | "NOT_READY" | "ADMIN";
export type Player = {
  name: string;
  hand: string[];
  status: PlayerStatus;
};

export type PlayerWithId = Player & ID;
