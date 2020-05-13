import React from 'react';
import './App.css';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Header } from './Header';
import { Architect } from '../routes/Architect';
import { CreateSuite } from '../routes/CreateSuite';
import { ModifiableSuites } from '../routes/ModifiableSuites';
import { Home } from '../routes/Home';

function App() {
  return (
    <Router>
      <div>
        <Header />
      </div>

      <Switch>
        <Route path="/architect/create_suite">
          <CreateSuite />
        </Route>
        <Route path="/architect/suites">
          <ModifiableSuites />
        </Route>
        <Route path="/architect">
          <Architect />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
