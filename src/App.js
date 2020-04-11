import React, { Suspense } from "react";
import "./App.css";
import "../node_modules/react-vis/dist/style.css";
import { Router, Route } from "react-router-dom";
import ServerButtons from "./components/ServerButtons";
import MainGraph from "./components/MainGraph";
import history from "./history";
import SingleGraph from "./components/SingleGraph";

const App = () => {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading</div>}>
        <Router history={history}>
          <div>
            <ServerButtons />
            <Route path="/" exact component={MainGraph} />
            <Route
              path="/server/:id"
              render={props => <SingleGraph {...props} />}
            />
          </div>
        </Router>
      </Suspense>
    </div>
  );
};

export default App;
