import React from 'react';

export const ExpensesListTable = (props) => {
  const { expenses, onRemove, onEdit } = props;

  const rows = expenses.map((exp, n) => {
    const t = exp.splitBy.reduce((acc, i) => acc.concat(i.name).concat(', '), '');
    const p = t.slice(0, t.length - 2);

    return (
      <tr key={exp.id}>
        <td>{exp.date || ''}</td>
        <td>{exp.note || ''}</td>
        <td>{exp.amount || ''}</td>
        <td>{exp.category.name || ''}</td>
        <td>{p}</td>
        <td>{exp.paidBy.name || ''}</td>
        <td>
          <button
            name="Edit"
            onClick={() => onEdit(n)}
          >
          Edit
          </button>
        </td>
        <td>
          <button
            value="x"
            onClick={() => onRemove(exp.id)}
          >
          x
          </button>
        </td>
      </tr>
    );
  });

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
            <th>Edit</th>
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
