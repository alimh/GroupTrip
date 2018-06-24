import React from 'react';
import { Link } from 'react-router-dom';

export const Layout = props => (
  <div className="app-container">
    <header>
      <Link to="/">
        <h1>Group Trip</h1>
      </Link>
    </header>
    <div className="app-content">{props.children}</div>
    <footer>
      <p>
        Alim Haji
      </p>
    </footer>
  </div>
);

export default Layout;
