import { rootReducer } from "./reducers";
import { createStore } from "redux";
export const store = createStore(
  rootReducer /* preloadedState, */,
  // @ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
