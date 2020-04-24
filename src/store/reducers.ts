import { combineReducers } from "redux";
import { SessionWithId } from "../model/Session";
import { SessionActionTypes } from "./actions";

const initialState: SessionWithId = {
  id: "",
  code: "",
  status: "INITIAL",
  players: {},
  deck: {},
  admin: "",
};

function sessionReducer(state = initialState, action: SessionActionTypes) {
  switch (action.type) {
    case "CREATE_SESSION":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export const rootReducer = combineReducers({ session: sessionReducer });
export type ReduxStore = ReturnType<typeof rootReducer>;
