import React from 'react';
import { Link } from 'react-router-dom';

export const TripLinks = (props) => {
  const linkSettings = '/trips/'.concat(props.tripId).concat('/settings');
  return (
    <div className="links">
      <ul>
        <li>
          <Link to={linkSettings}>Settings</Link>
        </li>
      </ul>
    </div>
  );
};

export default TripLinks;
