import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { createBrowserHistory } from 'history';

import * as serviceWorker from './serviceWorker';
import { beforeBreadcrumb } from './utils/sentry';
import { sentryConfig } from './api/config';
import store from './store';
import { THEME } from './theme';
import { GlobalStyles } from './styles';
import App from './views/App';
import Entrance from './views/Entrance';
import { PersistGate } from './store/persistStore';
import { UnknownError } from './components/UnknownError';

const history = createBrowserHistory();

Sentry.init({
  dsn: sentryConfig.dsn,
  release: process.env.REACT_APP_VERSION,
  environment: process.env.NODE_ENV,
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
    }),
  ],
  tracesSampleRate: 1.0,
  beforeBreadcrumb,
});

const SentryRoute = Sentry.withSentryRouting(Route);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router history={history}>
        <PersistGate>
          <ThemeProvider theme={THEME}>
            <GlobalStyles />
            <Sentry.ErrorBoundary fallback={UnknownError} showDialog>
              <Switch>
                <SentryRoute path="/" exact component={Entrance} />
                <SentryRoute path="/room/:code" component={App} />
              </Switch>
            </Sentry.ErrorBoundary>
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
