import { combineReducers } from "redux";
import { sessionReducer } from "./session/reducer";
import { playerReducer } from "./playerHand/reducer";
import { SessionThunkDispatch } from "./session/actions";
import { PlayerThunkDispatch } from "./playerHand/actions";

export const rootReducer = combineReducers({
  session: sessionReducer,
  player: playerReducer,
});

export type ReduxThunkDispatch = SessionThunkDispatch & PlayerThunkDispatch;
export type ReduxStore = ReturnType<typeof rootReducer>;
