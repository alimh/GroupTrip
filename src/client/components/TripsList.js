import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';

export const TripsList = (props) => {
  const { trips } = props;
  return (
    <ListGroup>
      {trips.map(t => (
        <ListGroup.Item key={t.id}>
          <Link to={'/trips/'.concat(t.id)}>{t.name}</Link>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default TripsList;
