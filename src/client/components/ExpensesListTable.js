import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
        <Container>
          <Row>
            <Col>
              <h4>{exp.note || ''}</h4>
            </Col>
          </Row>
          <Row>
            <Col xs={8}>{exp.dateFormatted || ''}</Col>
            <Col>
              <h4>
                <div>{exp.amountFormatted || ''}</div>
              </h4>
            </Col>
          </Row>
          <Row>
            <Col>Category: {exp.category.name || ''}</Col>
            <Col>Split By: {p}</Col>
            <Col>Paid By: {exp.paidBy.name || ''}</Col>
          </Row>
          <Row>
            <Col>&nbsp;</Col>
          </Row>
          <Row className="float-right">
            <Col>
              <Button
                variant="outline-secondary"
                name="Edit"
                onClick={() => onEdit(n)}
                disabled={exp.buttonsDisabled || false}
              >
                Edit
              </Button>
              &nbsp;
              <Button
                variant="outline-danger"
                onClick={() => onRemove(exp.id)}
                disabled={exp.buttonsDisabled || false}
              >
                Remove
              </Button>
            </Col>
          </Row>
        </Container>
      </ListGroup.Item>
    );
  });

  return <ListGroup>{rows}</ListGroup>;
};

export default ExpensesListTable;
