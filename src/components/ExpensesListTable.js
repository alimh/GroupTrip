import React from 'react';

export const ExpensesListTable = (props) => {
  const { expenses, onRemove } = props;

  const rows = expenses.map(exp => (
    <tr key={exp.id}>
      <td>{exp.date || ''}</td>
      <td>{exp.note || ''}</td>
      <td>{exp.amount || ''}</td>
      <td>{exp.category.name || ''}</td>
      <td>{exp.splitBy.reduce((acc, i) => acc.concat(i.name).concat(', '), '')}</td>
      <td>{exp.paidBy.name || ''}</td>
      <td>
        <button
          value="x"
          onClick={() => onRemove(exp.id)}
        />
      </td>
    </tr>
  ));

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Note</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Split By</th>
            <th>Paid By</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesListTable;
