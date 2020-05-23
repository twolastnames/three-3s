import React from 'react';
import './App.css';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Header } from './Header';
import { Architect } from '../routes/Architect';
import { CreateSuite } from '../routes/CreateSuite';
import { ModifiableSuites } from '../routes/ModifiableSuites';
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

  const displayMessage = useCallback(appendMessage(messages, setMessages), [
    messages,
  ]);

  return (
    <Router>
      <div>
        <Header />
      </div>
      <ul className="messages">{messages}</ul>
      <Switch>
        <Route path="/architect/create_suite">
          <CreateSuite displayMessage={displayMessage} />
        </Route>
        <Route path="/architect/suites">
          <ModifiableSuites displayMessage={displayMessage} />
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
