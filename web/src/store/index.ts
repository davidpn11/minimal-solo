import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as Sentry from '@sentry/react';

import { rootReducer } from './rootReducer';

const sentryReduxEnhacer = Sentry.createReduxEnhancer();

const composeEnhancers = composeWithDevTools({ trace: true });
const store = createStore(
  rootReducer /* preloadedState, */,
  composeEnhancers(applyMiddleware(thunk), sentryReduxEnhacer),
);

export default store;
