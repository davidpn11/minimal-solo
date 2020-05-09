import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './store';
import { THEME } from './theme';
import { GlobalStyles } from './styles';
import { PersistGate } from './store/persistStore';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate>
        <ThemeProvider theme={THEME}>
          <GlobalStyles />
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
