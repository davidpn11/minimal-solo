import { ID } from "./Session";
import { Card } from "./Card";

export type Player = {
  name: string;
  hand: string[];
  isReady: boolean;
};

export type PlayerWithId = Player & ID;
