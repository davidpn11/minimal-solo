import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Entrance from "./views/Entrance";
import GameRoom from "./views/GameRoom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Entrance} />
        <Route path="/room/:id" component={GameRoom} />
      </Switch>
    </Router>
  );
}

export default App;
