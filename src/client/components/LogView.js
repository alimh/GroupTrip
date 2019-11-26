import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

const formatDate = d =>
  new Date(d).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });

export const LogView = (props) => {
  const { log } = props;
  const changesList = changes => (
    <ul>
      {changes.map((c, n) => (
        <li key={n}>
          <strong>{c.item}</strong>:{' '}
          {c.oldValue === '' ? '(blank)' : c.oldValue}
          {' => '}
          {c.newValue === '' ? '(blank)' : c.newValue}{' '}
        </li>
      ))}
    </ul>
  );
  return (
    <ListGroup variant="flush">
      {log.map(e => (
        <ListGroup.Item
          action
          onClick={() => props.onClick(e.expenseId)}
          key={e.id}
        >
          {formatDate(e.timestamp)}: <strong>{e.userId}</strong> {e.action}{' '}
          {e.note}
          {e.changes ? changesList(e.changes) : <div key="blank-changes" />}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default LogView;
