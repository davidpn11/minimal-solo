import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Entrance from './views/Entrance';
import GameRouter from './views/GameRouter';

export const ENTRANCE_ROUTE = '/' as const;

function App() {
  return (
    <Router>
      <Switch>
        <Route path={ENTRANCE_ROUTE} exact component={Entrance} />
        <Route path="/room/:id" component={GameRouter} />
      </Switch>
    </Router>
  );
}

export default App;
