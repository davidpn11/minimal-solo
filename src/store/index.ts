import { rootReducer } from "./rootReducer";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { loadState, saveState } from "./persistStore";

const store = createStore(
  rootReducer /* preloadedState, */,
  loadState(),
  compose(
    applyMiddleware(thunk),
    //@ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
