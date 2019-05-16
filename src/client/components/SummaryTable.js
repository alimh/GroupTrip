import React from 'react';
import Table from 'react-bootstrap/Table';

const formatMoney = (a) => {
  const value = a.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  const symbol = '$ ';
  const isNeg = a < 0;

  return !isNeg
    ? symbol.concat(value)
    : symbol
      .concat('(')
      .concat(value)
      .concat(')');
};

export const SummaryTable = (props) => {
  const { summary } = props;
  const rows = Object.keys(summary).map(name => (
    <tr key={name}>
      <td>{name || ''}</td>
      <td>
        {summary[name].owe !== null ? formatMoney(summary[name].owe) : ''}
      </td>
      <td>
        {summary[name].paid !== null ? formatMoney(summary[name].paid) : ''}
      </td>
      <td>
        {summary[name].owe !== null && summary[name].paid !== null
          ? formatMoney(summary[name].owe - summary[name].paid)
          : ''}
      </td>
    </tr>
  ));

  return (
    <Table striped bordered>
      <thead>
        <tr>
          <th>Name</th>
          <th>Owe</th>
          <th>Paid</th>
          <th>To pay / (collect)</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default SummaryTable;
