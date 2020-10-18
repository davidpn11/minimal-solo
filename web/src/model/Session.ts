import { SessionPlayer } from './Player';
import { Card } from './Card';
import { Option } from 'fp-ts/lib/Option';
import { Play } from './Play';

export type SessionStatus = 'INITIAL' | 'STARTING' | 'STARTED' | 'FINISHED';
export type GameDirection = 'LEFT' | 'RIGHT';

export type NoGameSession = {
  code: string;
  status: UnionExclude<SessionStatus, 'STARTED' | 'FINISHED'>;
  admin: string;
  deck: Normalized<Card>;
  players: Normalized<SessionPlayer>;
  loadingStatus: Option<number>;
};

export type LocalNoGameSession = Omit<NoGameSession, 'deck'>;
export type GameSession = {
  code: string;
  status: UnionExclude<SessionStatus, 'INITIAL' | 'STARTING'>;
  admin: string;
  deck: Normalized<Card>;
  activeCards: Normalized<Card>;
  cemetery: Normalized<Card>;
  currentCard: Card;
  players: Normalized<SessionPlayer>;
  currentPlayer: string;
  currentPlay: string;
  direction: GameDirection;
  progression: Normalized<Play>;
  winner: Option<SessionPlayer>;
};

export type LocalGameSession = Omit<GameSession, 'deck' | 'activeCards' | 'cemetery'>;

export type Session = GameSession | NoGameSession;
export type SessionWithId = (GameSession | NoGameSession) & ID;
export type LocalSession = LocalGameSession | LocalNoGameSession;
export type LocalGameSessionWithId = LocalGameSession & ID;
export type LocalNoGameSessionWithId = LocalNoGameSession & ID;
export type LocalSessionWithId = LocalGameSessionWithId | LocalNoGameSessionWithId;
