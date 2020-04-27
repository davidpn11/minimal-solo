import { combineReducers } from "redux";
import { sessionReducer } from "./session/reducers";
import { playerReducer } from "./playerHand/reducer";

export const rootReducer = combineReducers({
  session: sessionReducer,
  player: playerReducer,
});
export type ReduxStore = ReturnType<typeof rootReducer>;
