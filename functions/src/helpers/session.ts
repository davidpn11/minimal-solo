import * as R from "fp-ts/lib/Record";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import * as F from "fp-ts/lib/function";
import { pipe } from "fp-ts/function";

export function getSessionPlayerByPosition(
  players: Record<string, { position: number }>,
  position = 0
) {
  return pipe(
    players,
    R.toArray,
    A.map(([id, player]) => ({ id, ...player })),
    A.findFirst((player) => player.position === position),
    O.fold(() => {
      throw new Error("No player matches the next position.");
    }, F.identity)
  );
}
