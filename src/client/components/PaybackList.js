import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

const formatMoney = a =>
  '$ '.concat(a.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

export const PaybackList = (props) => {
  const { paybackList } = props;
  return (
    <ListGroup>
      {paybackList.map(i => (
        <ListGroup.Item key={i.id}>
          <strong>{i.pay}</strong> to pay <strong>{i.receive}</strong>{' '}
          {formatMoney(i.amount)}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default PaybackList;
