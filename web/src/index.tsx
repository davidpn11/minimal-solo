import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import * as serviceWorker from './serviceWorker';
import './utils/sentry';
import store from './store';
import { THEME } from './theme';
import { GlobalStyles } from './styles';
import App from './views/App';
import Entrance from './views/Entrance';
import { PersistGate } from './store/persistStore';
import { ErrorBoundary } from './components/ErrorBoundary';

export const ENTRANCE_ROUTE = '/' as const;

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <PersistGate>
          <ThemeProvider theme={THEME}>
            <GlobalStyles />
            <ErrorBoundary>
              <Switch>
                <Route path={ENTRANCE_ROUTE} exact component={Entrance} />
                <Route path="/room/:code" component={App} />
              </Switch>
            </ErrorBoundary>
          </ThemeProvider>
        </PersistGate>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
