import React from 'react';
import Table from 'react-bootstrap/Table';

export const SummaryTable = (props) => {
  const { summary } = props;
  const rows = Object.keys(summary).map(name => (
    <tr key={name}>
      <td>{name || ''}</td>
      <td>{'$ '.concat(summary[name].owe) || ''}</td>
      <td>{'$ '.concat(summary[name].paid) || ''}</td>
      <td>{'$ '.concat(summary[name].owe - summary[name].paid) || ''}</td>
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
