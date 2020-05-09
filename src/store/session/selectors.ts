import { Option } from "fp-ts/lib/Option";
import * as R from "fp-ts/lib/Record";
import { ReduxStore } from "../rootReducer";
import { LocalSessionWithId } from "../../model/Session";
import { SessionPlayer } from "../../model/Player";
import { pipe } from "fp-ts/lib/pipeable";
import { MIN_ROOM_SIZE } from "../../api/db/session";

export const getSession = (state: ReduxStore): LocalSessionWithId =>
  state.session;

export const getCurrentSessionPlayer = (
  state: ReduxStore
): Option<SessionPlayer> => R.lookup(state.player.id, state.session.players);

export const allPlayersReady = (state: ReduxStore): boolean => {
  if (R.size(state.session.players) < MIN_ROOM_SIZE) return false;

  return pipe(
    state.session.players,
    R.filter((player) => player.status !== "ADMIN"),
    R.every((player) => player.status === "READY")
  );
};
