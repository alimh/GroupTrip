import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ListGroup from 'react-bootstrap/ListGroup';

const formatMoney = a =>
  '$ '.concat(a.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

export const ExpensesListView = (props) => {
  const { expenses, onRemove, onEdit } = props;

  const rows = expenses.map((exp, n) => (
    // const t = exp.splitBy.reduce(
    //   (acc, i) => acc.concat(i.name).concat(', '),
    //   ''
    // );
    // const p = t.slice(0, t.length - 2);

    <ListGroup.Item key={exp.id} active={exp.active || false}>
      <Container>
        <Row>
          <Col>
            <h4>{exp.note || ''}</h4>
          </Col>
          <Col xs={4}>
            {' '}
            <h4>
              <div>{formatMoney(exp.amount || 0) || ''}</div>
            </h4>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>{exp.dateFormatted || ''}</Col>
        </Row>
        <Row className="float-right">
          <Col>
            {exp.canEdit ? (
              <Button
                variant="outline-secondary"
                name="Edit"
                onClick={() => onEdit(n)}
                disabled={!exp.canEdit || false}
              >
                Edit
              </Button>
            ) : (
              <div />
            )}
            &nbsp;
            {exp.canEdit ? (
              <Button
                variant="outline-danger"
                onClick={() => onRemove(exp.id)}
                disabled={!exp.canEdit || false}
              >
                Remove
              </Button>
            ) : (
              <div />
            )}
          </Col>
        </Row>
      </Container>
    </ListGroup.Item>
  ));

  return <ListGroup>{rows}</ListGroup>;
};

export default ExpensesListView;
