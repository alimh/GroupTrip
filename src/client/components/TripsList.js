import React from 'react';
import { Link } from 'react-router-dom';

export const TripsList = (props) => {
  const { trips } = props;
  return (
    <div>
      <ul>
        {trips.map(t => (
          <li key={t.id}>
            <Link to={'/trips/'.concat(t.id)}>{t.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TripsList;
