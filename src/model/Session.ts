import { Player } from "./Player";
import { Card } from "./Card";
import { Option } from "fp-ts/lib/Option";

export type SessionStatus = "INITIAL" | "STARTED" | "FINISHED";

export type NoGameSession = {
  id: string;
  code: string;
  status: "NONE";
};

export type GameSession = {
  id: string;
  code: string;
  status: SessionStatus;
  game: Game;
  admin: Player;
};

export type Session = GameSession | NoGameSession;

type Game = {
  players: Player[];
  round: Round;
  deck: Card[];
  activeCard: Card;
  cemetery: Card[];
  progression: Round[];
  winner: Option<Player>;
};

type Round = {
  plays: Play[];
  currentPlayer: Player;
  queue: Player[];
  direction: "LEFT" | "RIGHT";
};

type Play = {
  player: Player;
  type: "PLAY_CARD" | "DRAW_CARD" | "ACTION";
  card: Option<Card>;
  target: Option<Player>;
};
