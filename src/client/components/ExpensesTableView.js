import React from 'react';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import ReactTable from 'react-table';
// import 'react-table/react-table.css';

// needed for bug https://spectrum.chat/react-table/general/v6-10-3-proptypes-fail-for-component-props~9ca49c7e-df58-4488-97eb-ab168570d597
delete ReactTable.propTypes.TableComponent;
delete ReactTable.propTypes.TheadComponent;
delete ReactTable.propTypes.TbodyComponent;
delete ReactTable.propTypes.TrGroupComponent;
delete ReactTable.propTypes.TrComponent;
delete ReactTable.propTypes.ThComponent;
delete ReactTable.propTypes.TdComponent;
delete ReactTable.propTypes.TfootComponent;
delete ReactTable.propTypes.FilterComponent;
delete ReactTable.propTypes.ExpanderComponent;
delete ReactTable.propTypes.PivotValueComponent;
delete ReactTable.propTypes.AggregatedComponent;
delete ReactTable.propTypes.PivotComponent;
delete ReactTable.propTypes.PaginationComponent;
delete ReactTable.propTypes.PreviousComponent;
delete ReactTable.propTypes.NextComponent;
delete ReactTable.propTypes.LoadingComponent;
delete ReactTable.propTypes.NoDataComponent;
delete ReactTable.propTypes.ResizerComponent;
delete ReactTable.propTypes.PadRowComponent;
delete ReactTable.propTypes.columns.Cell;

const formatMoney = (a) => '$ '.concat(a.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
});

export const ExpensesTableView = (props) => {
  const { expenses, onEdit } = props;
  const expensesFiltered = expenses.map((e, n) => ({
    id: e.id,
    n,
    date: formatDate(e.date),
    note: e.note,
    amount: formatMoney(e.amount),
    category: e.category.name,
    paidBy: e.paidBy.name,
    canEdit: e.canEdit,
    needsAttention: e.needsAttention,
    splitBy: e.splitBy
      .reduce((acc, i) => acc.concat(i.name).concat(', '), '')
      .slice(0, -2),
  }));

  const distinctCategories = [
    ...new Set(expenses.map((e) => e.category.name)),
  ].filter((f) => f !== '');
  const distinctPaidBy = [...new Set(expenses.map((e) => e.paidBy.name))].filter((f) => f !== '');
  const distinctSplitBy = [
    ...new Set(expenses
      .map((e) => e.splitBy)
      .flat()
      .map((f) => f.name)),
  ];
  return (
    <div>
      <ReactTable
        data={expensesFiltered}
        filterable
        minRows={2}
        columns={[
          {
            Header: 'Date',
            accessor: 'date',
            Filter: () => <div />,
          },
          {
            Header: 'Note',
            accessor: 'note',
            filterMethod: (filter, row) => row[filter.id].toLowerCase().includes(filter.value.toLowerCase()),
          },
          {
            Header: 'Amount',
            accessor: 'amount',
            filterMethod: (filter, row) => row[filter.id].includes(filter.value),
          },
          {
            Header: 'Category',
            accessor: 'category',
            Filter: ({ filter, onChange }) => (
              <select
                onChange={(event) => onChange(event.target.value)}
                style={{ width: '100%' }}
                value={filter ? filter.value : ''}
              >
                <option key="(all)" value="" />
                {distinctCategories.map((c) => (
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
                onChange={(event) => onChange(event.target.value)}
                style={{ width: '100%' }}
                value={filter ? filter.value : ''}
              >
                <option key="(all)" value="" />
                {distinctPaidBy.map((p) => (
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
                onChange={(event) => onChange(event.target.value)}
                style={{ width: '100%' }}
                value={filter ? filter.value : ''}
              >
                <option key="(all)" value="" />
                {distinctSplitBy.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ),
            filterMethod: (filter, row) => row[filter.id].includes(filter.value),
          },
          {
            Header: '',
            accessor: 'n',
            Filter: () => <div />,
            Cell: (row) => (
              <div style={{ textAlign: 'center' }}>
                <Button
                  style={{ margin: '0 auto' }}
                  variant="outline-secondary"
                  name="Edit"
                  onClick={() => onEdit(row.value)}
                >
                  View
                </Button>
              </div>
            ),
          },
          {
            Header: '',
            //              accessor: 'id',
            Filter: () => <div />,
            Cell: (row) => (
              <div style={{ textAlign: 'center' }}>
                {row.original.canEdit && row.original.needsAttention ? (
                  <Badge variant="warning">Incomplete</Badge>
                ) : (
                  <div />
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default ExpensesTableView;
