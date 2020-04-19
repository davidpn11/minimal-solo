import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import RoomSelect from "./views/RoomSelect";
import NameSelect from "./views/NameSelect";
import GameRoom from "./views/GameRoom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={RoomSelect} />
        <Route path="/room/:id" component={GameRoom} />
        {/* <Route path="/room/:id" component={RoomSelect} /> */}
      </Switch>
    </Router>
  );
}

export default App;
