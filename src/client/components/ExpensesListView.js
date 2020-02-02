import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';

import ListGroup from 'react-bootstrap/ListGroup';

const formatMoney = (a) => '$ '.concat(a.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

export const ExpensesListView = (props) => {
  const { expenses, onEdit, tripId } = props;

  const rows = expenses.map((exp, n) => (
    <ListGroup.Item key={exp.id} active={exp.active || false}>
      <Row>
        <Col style={{ textAlign: 'right', paddingBottom: '10px' }}>
          {exp.canEdit && exp.needsAttention
            ? (
              <>
                <Badge variant="warning">Incomplete</Badge>
              </>
            )
            : (
              <div />
            )}
        </Col>
      </Row>
      <Row>
        <Col>
          <h4>{exp.note || ''}</h4>
        </Col>
        <Col xs={6} style={{ textAlign: 'right' }}>
          <h4>
            <div>{formatMoney(exp.amount || 0) || ''}</div>
          </h4>
        </Col>
      </Row>
      <Row>
        <Col>{exp.dateFormatted || ''}</Col>
      </Row>
      <Row>
        <Col style={{ textAlign: 'right', paddingTop: '10px' }}>
          <Button
            variant="outline-secondary"
            name="View"
            onClick={() => onEdit(n)}
          >
            View
          </Button>
        </Col>
      </Row>
    </ListGroup.Item>
  ));

  const rowsWithAdd = [
    rows,
    <ListGroup.Item key="show-all" style={{ textAlign: 'center' }}>
      <Button variant="link">
        <Link to={'/trips/'.concat(tripId).concat('/expenses')}>Go to Expense Table</Link>
      </Button>
    </ListGroup.Item>,
  ];
  return <ListGroup>{rowsWithAdd}</ListGroup>;
};

export default ExpensesListView;
