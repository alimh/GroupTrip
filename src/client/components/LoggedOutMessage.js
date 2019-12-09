import React from 'react';
import { Link } from 'react-router-dom';

export const LoggedOutMessage = () => (
  <span>
    Your session has expired.{' '}
    <Link to="#" onClick={() => window.location.reload()}>
      Reload
    </Link>{' '}
    or <Link to="/login">login.</Link>
  </span>
);

export default LoggedOutMessage;
