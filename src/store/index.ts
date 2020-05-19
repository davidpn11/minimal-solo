import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { rootReducer } from './rootReducer';

const store = createStore(
  rootReducer /* preloadedState, */,
  compose(
    applyMiddleware(thunk),
    //@ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  ),
);

export default store;
