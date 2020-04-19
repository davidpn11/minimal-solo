import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Lobby from "./views/Lobby";
import NameSelect from "./views/NameSelect";
import GameRoom from "./views/GameRoom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Lobby} />
        <Route path="/room/:id" component={GameRoom} />
      </Switch>
    </Router>
  );
}

export default App;
