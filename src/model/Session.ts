import { SessionPlayer } from "./Player";
import { Card } from "./Card";
import { Option } from "fp-ts/lib/Option";

type UnionExclude<T, K> = T extends K ? never : T;
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
  players: Normalized<SessionPlayer>;
};

export type LocalNoGameSession = Omit<NoGameSession, "deck">;

export type GameSession = {
  code: string;
  status: UnionExclude<SessionStatus, "INITIAL">;
  admin: string;
  deck: Normalized<Card>;
  activeCards: Normalized<Card>;
  cemetery: Normalized<Card>;
  currentCard: Card;
  players: Normalized<SessionPlayer>;
  currentPlayer: string;
  direction: "LEFT" | "RIGHT";
  progression: Play[];
  winner: Option<SessionPlayer>;
};

export type LocalGameSession = Omit<
  GameSession,
  "deck" | "activeCards" | "cemetery"
>;

export type Session = GameSession | NoGameSession;
export type SessionWithId = (GameSession | NoGameSession) & ID;
export type LocalSessionWithId = (LocalGameSession | LocalNoGameSession) & ID;

export type Play = {
  player: SessionPlayer;
  type: "PLAY_CARD" | "DRAW_CARD" | "ACTION";
  card: Option<Card>;
  target: Option<SessionPlayer>;
};
