import React from 'react';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

export const ExpensesListTable = (props) => {
  const { expenses, onRemove, onEdit } = props;

  const rows = expenses.map((exp, n) => {
    const t = exp.splitBy.reduce(
      (acc, i) => acc.concat(i.name).concat(', '),
      ''
    );
    const p = t.slice(0, t.length - 2);

    return (
      <ListGroup.Item key={exp.id} active={exp.active || false}>
        <h4>{exp.note || ''}</h4>
        {exp.date || ''}
        <div>{exp.amount || ''}</div>
        <div>Category: {exp.category.name || ''}</div>
        <div>Split By: {p}</div>
        <div>Paid By: {exp.paidBy.name || ''}</div>
        <Button
          variant="secondary"
          name="Edit"
          onClick={() => onEdit(n)}
          disabled={exp.buttonsDisabled || false}
        >
          Edit
        </Button>
        <Button
          variant="light"
          onClick={() => onRemove(exp.id)}
          disabled={exp.buttonsDisabled || false}
        >
          Remove
        </Button>
      </ListGroup.Item>
    );
  });

  return <ListGroup>{rows}</ListGroup>;
};

export default ExpensesListTable;
