import { Option } from "fp-ts/lib/Option";
import * as R from "fp-ts/lib/Record";
import { ReduxStore } from "../rootReducer";
import { LocalSessionWithId } from "../../model/Session";
import { SessionPlayer } from "../../model/Player";

export const getSession = (state: ReduxStore): LocalSessionWithId =>
  state.session;

export const getCurrentSessionPlayer = (
  state: ReduxStore
): Option<SessionPlayer> => R.lookup(state.player.id, state.session.players);
