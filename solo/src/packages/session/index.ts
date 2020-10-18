import { createErrorClass } from "../utils/error";

export const NoGameSessionError = createErrorClass(
  "NoGameSession",
  'Should not have "No Game Session"',
  false,
  "fatal"
);

export const NoLobbySessionError = createErrorClass(
  "NoLobbySession",
  'Should not have "No Lobby Session"',
  false,
  "fatal"
);

export const NoLoadingSessionError = createErrorClass(
  "NoLoadingSession",
  'Should not have "LoadingSession"',
  false,
  "fatal"
);

export const GameSessionError = createErrorClass(
  "GameSession",
  'Should not have "Game Session"',
  false,
  "fatal"
);

export const SessionNotFoundError = (sessionCode: string) =>
  createErrorClass(
    "SessionNotFound",
    `Couldn't find a session with code ${sessionCode}`,
    true,
    "error"
  );

type FoldParams<B = void> = {
  whenNoGameSession?: (s: NoSession) => B;
  whenLobbySession?: (s: LocalNoGameSessionWithId) => B;
  whenLoadingSession?: (s: LocalNoGameSessionWithId) => B;
  whenGameStarted?: (s: LocalGameSessionWithId) => B;
};

const foldGameSessionDefault = {
  whenNoGameSession: () => {
    throw new NoGameSessionError();
  },
  whenLobbySession: () => {
    throw new NoLobbySessionError();
  },
  whenLoadingSession: () => {
    throw new NoLoadingSessionError();
  },
  whenGameStarted: () => {
    throw new GameSessionError();
  },
};

export function foldGameSession<B>({
  whenNoGameSession = foldGameSessionDefault.whenNoGameSession,
  whenLobbySession = foldGameSessionDefault.whenLobbySession,
  whenLoadingSession = foldGameSessionDefault.whenLoadingSession,
  whenGameStarted = foldGameSessionDefault.whenGameStarted,
}: FoldParams<B>) {
  return (session: SessionStore): B => {
    switch (session.status) {
      case "INITIAL":
        return whenNoGameSession(session);
      case "LOBBY":
        return whenLobbySession(session);
      case "STARTING":
        return whenLoadingSession(session);
      case "STARTED":
      case "FINISHED":
        return whenGameStarted(session);
      default:
        throw new Error("No Status found");
    }
  };
}
