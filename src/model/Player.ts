import { Card } from "./Card";
export type Player = {
  id?: string;
  name: string;
  hand: Card[];
  uno?: boolean;
};
