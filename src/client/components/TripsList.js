import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { LinkContainer } from 'react-router-bootstrap';

export const TripsList = (props) => {
  const { trips } = props;
  return (
    <ListGroup>
      {trips.map(t => (
        <LinkContainer key={t.id} to={'/trips/'.concat(t.id)}>
          <ListGroup.Item action key={t.id}>
            {t.name}
          </ListGroup.Item>
        </LinkContainer>
      ))}
    </ListGroup>
  );
};

export default TripsList;
