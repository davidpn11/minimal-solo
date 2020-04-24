import { Player } from "./Player";
import { Card } from "./Card";
import { Option } from "fp-ts/lib/Option";

export type SessionStatus = "INITIAL" | "STARTED" | "FINISHED";
export type ID = { id: string };

export type Normalized<T> = {
  [id: string]: T;
};

export type NoGameSession = {
  code: string;
  status: "INITIAL";
  admin: string;
  deck: Normalized<Card>;
  players: Normalized<Player>;
};

export type GameSession = {
  code: string;
  status: Omit<SessionStatus, "INITIAL">;
  admin: string;
  deck: Normalized<Card>;
  players: Normalized<Player>;
  round: Round;
  activeCard: Card;
  cemetery: Normalized<Card>;
  progression: Normalized<Round>;
  winner: Option<Player>;
};

export type Session = GameSession | NoGameSession;
export type SessionWithId = (GameSession | NoGameSession) & ID;

// TODO: RETHINK ROUND/PLAY CONCEPT
export type Round = {
  plays: Play[];
  currentPlayer: Player;
  queue: Player[];
  direction: "LEFT" | "RIGHT";
};

export type Play = {
  player: Player;
  type: "PLAY_CARD" | "DRAW_CARD" | "ACTION";
  card: Option<Card>;
  target: Option<Player>;
};
