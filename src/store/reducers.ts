import { combineReducers } from "redux";
import { Action } from "redux";
import { Session } from "../model/Session";
import * as O from "fp-ts/lib/Option";

const initialState: Session = {
  id: "",
  code: "",
  status: "NONE",
};

function sessionReducer(state = initialState, action: Action) {
  switch (action.type) {
    default:
      return state;
  }
}

export const rootReducer = combineReducers({ session: sessionReducer });
