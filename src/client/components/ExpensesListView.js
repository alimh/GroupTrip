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
  ));

  return <ListGroup>{rows}</ListGroup>;
};

export default ExpensesListView;
