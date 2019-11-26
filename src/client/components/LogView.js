import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

export const LogView = (props) => {
  const { log } = props;
  return (
    <ListGroup>
      {log.map(e => (
        <ListGroup.Item key={e.id}>
          <strong>{e.userId}</strong> {e.action}{' '}
          <p onClick={() => props.onClick(e.expenseId)}>{e.note}</p>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default LogView;
