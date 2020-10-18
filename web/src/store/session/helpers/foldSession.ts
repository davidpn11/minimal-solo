import {
  NoGameSessionError,
  NoLoadingSessionError,
  GameSessionError,
  NoLobbySessionError,
} from '../../../model/Error';

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
      case 'INITIAL':
        return whenNoGameSession(session);
      case 'LOBBY':
        return whenLobbySession(session);
      case 'STARTING':
        return whenLoadingSession(session);
      case 'STARTED':
      case 'FINISHED':
        return whenGameStarted(session);
      default:
        throw new Error('No Status found');
    }
  };
}

//required to handle void return cases if necessary
export const getOrThrow = <T>(p: T | void) => {
  if (typeof p === 'undefined') throw new Error('Get or throw used');
  return p;
};
