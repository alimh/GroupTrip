import React from 'react';

export const SummaryTable = (props) => {
  const { summary } = props;
  const rows = Object.keys(summary).map(name => (
    <tr key={name}>
      <td>{name || ''}</td>
      <td>{summary[name].owe || ''}</td>
      <td>{summary[name].paid || ''}</td>
      <td>{(summary[name].owe - summary[name].paid) || ''}</td>
    </tr>
  ));

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Owe</th>
            <th>Paid</th>
            <th>To pay / (collect)</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  );
};

export default SummaryTable;
