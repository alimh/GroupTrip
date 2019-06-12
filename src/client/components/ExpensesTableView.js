import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

import ListGroup from 'react-bootstrap/ListGroup';

const formatMoney = a =>
  '$ '.concat(a.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

export const ExpensesTableView = (props) => {
  const { expenses, onRemove, onEdit } = props;

  const expensesFiltered = expenses.map(e => ({
    date: e.dateFormatted,
    note: e.note,
    amount: formatMoney(e.amount),
  }));
  // const rows = expenses.map((exp, n) => {
  //   const t = exp.splitBy.reduce(
  //     (acc, i) => acc.concat(i.name).concat(', '),
  //     ''
  //   );
  //   const p = t.slice(0, t.length - 2);

  //   return (
  //     <div>
  //       <ListGroup.Item key={exp.id} active={exp.active || false}>
  //         <Container>
  //           <Row>
  //             <Col>
  //               <h4>{exp.note || ''}</h4>
  //             </Col>
  //           </Row>
  //           <Row>
  //             <Col xs={4}>{exp.dateFormatted || ''}</Col>
  //             <Col>
  //               <h4>
  //                 <div>{formatMoney(exp.amount || 0) || ''}</div>
  //               </h4>
  //             </Col>
  //           </Row>
  //           <Row>
  //             <Col>Category: {exp.category.name || ''}</Col>
  //             <Col>Split By: {p}</Col>
  //             <Col>Paid By: {exp.paidBy.name || ''}</Col>
  //           </Row>
  //           <Row>
  //             <Col>&nbsp;</Col>
  //           </Row>
  //           <Row className="float-right">
  //             <Col>
  //               <Button
  //                 variant="outline-secondary"
  //                 name="Edit"
  //                 onClick={() => onEdit(n)}
  //                 disabled={exp.buttonsDisabled || false}
  //               >
  //                 Edit
  //               </Button>
  //               &nbsp;
  //               <Button
  //                 variant="outline-danger"
  //                 onClick={() => onRemove(exp.id)}
  //                 disabled={exp.buttonsDisabled || false}
  //               >
  //                 Remove
  //               </Button>
  //             </Col>
  //           </Row>
  //         </Container>
  //       </ListGroup.Item>
  //     </div>
  //   );
  // });
  return (
    <div>
      <ReactTable
        data={expensesFiltered}
        filterable
        columns={[
          { Header: 'Date', accessor: 'date' },
          { Header: 'Note', accessor: 'note' },
          { Header: 'Amount', accessor: 'amount' },
        ]}
      />
    </div>
  );
};

export default ExpensesTableView;
