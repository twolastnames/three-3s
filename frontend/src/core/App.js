import React from 'react';
import './App.css';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Header } from './Header';
import { Architect } from '../routes/Architect';
import { CreateSuite } from '../routes/CreateSuite';
import { ModifiableSuites } from '../routes/ModifiableSuites';
import { ModifiableSuite } from '../routes/ModifiableSuite';
import { ModifiableScenario } from '../routes/ModifiableScenario';
import { useCallback, useState } from 'react';
import { Home } from '../routes/Home';
import { Message } from './Message';

let reactKey = 0;

const appendMessage = (messages, setMessages) => (level, message) => {
  const newComponent = (
    <Message key={++reactKey} level={level} message={message} />
  );
  setMessages([...messages, newComponent]);
};

function App() {
  const [messages, setMessages] = useState([]);

  window.displayMessage = useCallback(appendMessage(messages, setMessages), [
    messages,
  ]);

  return (
    <Router>
      <div>
        <Header />
      </div>
      <ul className="messages">{messages}</ul>
      <Switch>
        <Route path="/architect/create_suite" component={CreateSuite} />
        <Route path="/architect/suites/:id" component={ModifiableSuite} />
        <Route path="/architect/suites" component={ModifiableSuites} />
        <Route path="/architect/scenarios/:id" component={ModifiableScenario} />
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
