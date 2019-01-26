import React from 'react';
// import Button from 'react-bulma-components/lib/components/button';

export const ExpensesListTable = (props) => {
  const { expenses, onRemove, onEdit } = props;

  const rows = expenses.map((exp, n) => {
    const t = exp.splitBy.reduce(
      (acc, i) => acc.concat(i.name).concat(', '),
      ''
    );
    const p = t.slice(0, t.length - 2);

    return (
      <div key={exp.id}>
        <div>
          <div xs={4}>{exp.date || ''}</div>
          <div xs={4}>{exp.note || ''}</div>
          <div xs={4}>{exp.amount || ''}</div>
        </div>
        <div>
          <div>
            <div>
              Category:
              {exp.category.name || ''}
              <br />
              Split By: {p}
              <br />
              {exp.paidBy.name || ''}
              <br />
            </div>
            <div>
              <button
                variant="contained"
                color="primary"
                name="Edit"
                onClick={() => onEdit(n)}
              >
                Edit
              </button>
              <button value="x" onClick={() => onRemove(exp.id)}>
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return rows;
};

export default ExpensesListTable;
