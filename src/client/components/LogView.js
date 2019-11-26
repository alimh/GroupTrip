import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

export const LogView = (props) => {
  const { log } = props;
  return (
    <ListGroup variant="flush">
      {log.map(e => (
        <ListGroup.Item
          action
          onClick={() => props.onClick(e.expenseId)}
          key={e.id}
        >
          {e.timestamp}: <strong>{e.userId}</strong> {e.action} {e.note}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default LogView;
