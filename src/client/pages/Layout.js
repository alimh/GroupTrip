import React from 'react';
import { Link } from 'react-router-dom';

export const Layout = props => (
  <div className="app-container">
    <header>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/summary">Summary</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
        <li>
          <Link to="/new">New Trip</Link>
        </li>
      </ul>
    </header>

    <div className="app-content">{props.children}</div>

    <footer>
      <p>Alim Haji</p>
    </footer>
  </div>
);

export default Layout;
