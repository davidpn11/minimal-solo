export type Severity =
  | "fatal"
  | "error"
  | "warning"
  | "log"
  | "info"
  | "debug"
  | "critical";

export type CustomError = Error & {
  expected: boolean;
  level: Severity;
};

export function createErrorClass(
  name: string,
  message: string,
  expected: boolean,
  level: Severity
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
