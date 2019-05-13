import React from 'react';
import { Link } from 'react-router-dom';

export const Layout = props => (
  <div className="app-container">
    <h1>
      <Link to="/">GroupTrip!</Link>
    </h1>

    <div className="app-content">{props.children}</div>
    <footer className="page-footer font-small blue pt-4" />
  </div>
);

export default Layout;
