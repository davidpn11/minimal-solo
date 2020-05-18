import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Entrance from './views/Entrance';
import GameRouter from './views/GameRouter';

export const ENTRANCE_ROUTE = '/' as const;

function App() {
  return (
    <Switch>
      <Route path={ENTRANCE_ROUTE} exact component={Entrance} />
      <Route path="/room/:code" component={GameRouter} />
    </Switch>
  );
}

export default App;
