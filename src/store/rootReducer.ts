import { combineReducers } from "redux";
import { sessionReducer } from "./session/reducers";

export const rootReducer = combineReducers({ session: sessionReducer });
export type ReduxStore = ReturnType<typeof rootReducer>;
