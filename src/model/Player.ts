import { Card } from "./Card";
import { ID, Normalized } from "./Session";

export type Player = {
  name: string;
  hand: Normalized<Card>;
  uno: boolean;
};

export type PlayerWithId = Player & ID;
