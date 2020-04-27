import { ReduxStore } from "../rootReducer";
import { LocalSessionWithId } from "../../model/Session";

export const getSession = (state: ReduxStore): LocalSessionWithId =>
  state.session;
