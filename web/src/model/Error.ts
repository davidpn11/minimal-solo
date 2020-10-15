import { Severity } from '@sentry/browser';

export type CustomError = Error & {
  expected: boolean;
  level: Severity;
};

export function createErrorClass(
  name: string,
  message: string,
  expected: boolean,
  level: Severity,
) {
  return class extends Error {
    public expected: boolean;
    public level: Severity;

    constructor() {
      super();
      this.name = name;
      this.message = message;
      this.expected = expected;
      this.level = level;
    }
  };
}

export const NoGameSessionError = createErrorClass(
  'NoGameSession',
  'Should not have "No Game Session"',
  false,
  Severity.Fatal,
);

export const NoLoadingSessionError = createErrorClass(
  'NoLoadingSession',
  'Should not have "LoadingSession"',
  false,
  Severity.Fatal,
);

export const GameSessionError = createErrorClass(
  'GameSession',
  'Should not have "Game Session"',
  false,
  Severity.Fatal,
);

export const SessionNotFoundError = (sessionCode: string) =>
  createErrorClass(
    'SessionNotFound',
    `Couldn't find a session with code ${sessionCode}`,
    true,
    Severity.Error,
  );
