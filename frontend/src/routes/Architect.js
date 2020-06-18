import React from 'react';

import { Link } from 'react-router-dom';

export function Architect() {
  return (
    <div className='route'>
      <h2>Architect</h2>
      <ul>
        <li>
          <Link to="/architect/suites">Suites</Link>
        </li>
        <li>
          <Link to="/architect/create_suite">Create Suite</Link>
        </li>
        <li>
          <Link to="/architect/create_scenario">Create Scenario</Link>
        </li>
      </ul>
    </div>
  );
}
