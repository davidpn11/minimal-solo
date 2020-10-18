interface None {
  readonly _tag: "None";
}
interface Some<A> {
  readonly _tag: "Some";
  readonly value: A;
}
type Option<A> = None | Some<A>;

declare type SessionStatus = "INITIAL" | "STARTING" | "STARTED" | "FINISHED";
declare type GameDirection = "LEFT" | "RIGHT";

declare type LocalNoGameSession = {
  admin: string;
  code: string;
  currentCard: Card;
  currentPlay: string;
  currentPlayer: string;
  direction: GameDirection;
  players: Record<string, SessionPlayer>;
  status: "INITIAL" | "STARTING";
  winner: Option<string>;
};
declare type LocalNoGameSessionWithId = LocalNoGameSession & ID;

declare type SessionQueryResult = {
  admin: string;
  code: string;
  currentCard: Card;
  currentPlay: string;
  currentPlayer: string;
  direction: GameDirection;
  status: SessionStatus;
  winner: Option<String>;
};

declare type Progression = Record<string, Play>;

declare type LocalGameSession = {
  admin: string;
  cemetery: Record<string, Card>;
  code: string;
  currentCard: Card;
  currentPlay: string;
  currentPlayer: string;
  direction: GameDirection;
  players: Record<string, SessionPlayer>;
  progression: Progression;
  status: "STARTED" | "FINISHED";
  winner: Option<String>;
};
declare type LocalGameSessionWithId = LocalGameSession & ID;

declare type LocalSession = LocalGameSession | LocalNoGameSession;
declare type LocalSessionWithId = LocalSession & ID;
