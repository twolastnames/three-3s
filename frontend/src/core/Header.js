import React from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <nav>
      <div className='nav-header'>threAS3</div>
      <ul>
        <li>
          <Link to="/architect">Architect</Link>
        </li>
      </ul>
    </nav>
  );
}
