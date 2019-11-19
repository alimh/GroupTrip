import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';

import ListGroup from 'react-bootstrap/ListGroup';

const formatMoney = a =>
  '$ '.concat(a.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

export const ExpensesListView = (props) => {
  const { expenses, onEdit } = props;

  const rows = expenses.map((exp, n) => (
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
          <Col>
            {exp.canEdit && exp.needsAttention ? (
              <Badge variant="warning">Incomplete</Badge>
            ) : (
              <div />
            )}
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
          </Col>
        </Row>
      </Container>
    </ListGroup.Item>
  ));

  const rowsWithAdd = [
    rows,
    <ListGroup.Item key="show-all">...</ListGroup.Item>,
  ];
  return <ListGroup>{rowsWithAdd}</ListGroup>;
};

export default ExpensesListView;
