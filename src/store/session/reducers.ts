import { LocalSessionWithId } from "../../model/Session";
import { SessionActionTypes } from "./actions";

const initialState: LocalSessionWithId = {
  id: "",
  code: "",
  status: "INITIAL",
  players: {},
  admin: "",
};

export function sessionReducer(
  state = initialState,
  action: SessionActionTypes
): LocalSessionWithId {
  switch (action.type) {
    case "CREATE_SESSION":
      return { ...state, ...action.payload };
    case "CLEAR_SESSION":
      return initialState;
    case "ADD_PLAYER":
      return {
        ...state,
        players: {
          ...state.players,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}
