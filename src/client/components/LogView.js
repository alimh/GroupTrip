/* eslint react/no-array-index-key: "off" */

import React from 'react';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
});

export const LogView = (props) => {
  const {
    log, onClick, onShowAll, isAll,
  } = props;
  const changesList = (changes) => (
    <ul>
      {changes.map((c, n) => (
        <li key={n}>
          <strong>{c.item}</strong>
          :
          {' '}
          {c.oldValue === '' ? '' : c.oldValue}
          {c.oldValue === '' || c.oldValue === null ? '' : ' => '}
          {c.newValue === '' ? '(blank)' : c.newValue}
          {' '}
        </li>
      ))}
    </ul>
  );

  const rows = log.map((e) => (
    <ListGroup.Item
      action
      onClick={() => onClick(e.expenseId)}
      key={e.id}
    >
      {formatDate(e.timestamp)}
      :
      {' '}
      <strong>{e.userName}</strong>
      {' '}
      {e.action}
      {' '}
      {e.note}
      {e.changes ? changesList(e.changes) : <div key="blank-changes" />}
    </ListGroup.Item>
  ));

  const rowsWithAdd = [
    rows,
    <ListGroup.Item key="show-all" style={{ textAlign: 'center' }}>
      <Button variant="link" onClick={() => onShowAll()}>
        Show All
      </Button>
    </ListGroup.Item>,
  ];

  return (
    <ListGroup variant="flush">
      {isAll ? rows : rowsWithAdd}
    </ListGroup>
  );
};

export default LogView;
