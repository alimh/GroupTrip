import React from 'react';
import Button from 'react-bootstrap/Button';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

const formatMoney = a =>
  (a !== null
    ? "$ ".concat(a.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,"))
    : "");

export const ExpensesTableView = (props) => {
  const { expenses, onRemove, onEdit } = props;
  const expensesFiltered = expenses.map((e, n) => ({
    id: e.id,
    n,
    date: e.dateFormatted,
    note: e.note,
    amount: formatMoney(e.amount),
    category: e.category.name,
    paidBy: e.paidBy.name,
    splitBy: e.splitBy
      .reduce((acc, i) => acc.concat(i.name).concat(', '), '')
      .slice(0, -2),
  }));

  const distinctCategories = [
    ...new Set(expenses.map(e => e.category.name)),
  ].filter(f => f !== '');
  const distinctPaidBy = [...new Set(expenses.map(e => e.paidBy.name))].filter(f => f !== '');
  const distinctSplitBy = [
    ...new Set(expenses
        .map(e => e.splitBy)
        .flat()
        .map(f => f.name)),
  ];
  return (
    <div>
      <ReactTable
        data={expensesFiltered}
        filterable
        minRows={2}
        columns={[
          { Header: 'Date', accessor: 'date' },
          {
            Header: 'Note',
            accessor: 'note',
            filterMethod: (filter, row) =>
              row[filter.id].toLowerCase().includes(filter.value.toLowerCase()),
          },
          {
            Header: 'Amount',
            accessor: 'amount',
            filterMethod: (filter, row) =>
              row[filter.id].includes(filter.value),
          },
          {
            Header: 'Category',
            accessor: 'category',
            Filter: ({ filter, onChange }) => (
              <select
                onChange={event => onChange(event.target.value)}
                style={{ width: '100%' }}
                value={filter ? filter.value : ''}
              >
                <option key="(all)" value="" />
                {distinctCategories.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            ),
          },
          {
            Header: 'Paid By',
            accessor: 'paidBy',
            Filter: ({ filter, onChange }) => (
              <select
                onChange={event => onChange(event.target.value)}
                style={{ width: '100%' }}
                value={filter ? filter.value : ''}
              >
                <option key="(all)" value="" />
                {distinctPaidBy.map(p => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            ),
          },
          {
            Header: 'Split By',
            accessor: 'splitBy',
            Filter: ({ filter, onChange }) => (
              <select
                onChange={event => onChange(event.target.value)}
                style={{ width: '100%' }}
                value={filter ? filter.value : ''}
              >
                <option key="(all)" value="" />
                {distinctSplitBy.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ),
            filterMethod: (filter, row) =>
              row[filter.id].includes(filter.value),
          },
          {
            Header: '',
            accessor: 'n',
            Cell: row => (
              <Button
                variant="outline-secondary"
                name="Edit"
                onClick={() => onEdit(row.value)}
              >
                Edit
              </Button>
            ),
          },
          {
            Header: '',
            accessor: 'id',
            Cell: row => (
              <Button
                variant="outline-danger"
                onClick={() => onRemove(row.value)}
              >
                Remove
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
};

export default ExpensesTableView;
