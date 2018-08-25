import React from 'react';
import Axios from 'axios';
import Auth from '../utils/Auth';
import { LoadingView } from './LoadingView';
import { ExpensesListTable } from './ExpensesListTable';
import { EditExpense } from './EditExpense';

export class ExpensesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      key: Math.random(),
      keyEditExpense: null,
      loading: true,
      expenses: null,
      expenseObjectToEdit: null,
    };
  }

  componentDidMount() {
    this.getExpenses();
  }

  getExpenses() {
    const authorizationHeader = 'bearer '.concat(Auth.getToken());
    Axios.get('/api/expenses/all', { headers: { Authorization: authorizationHeader } })
      .then((response) => {
        const { data } = response;
        this.setState({ loading: false, expenses: data });
      })
      .catch((err) => {
        this.setState({ loading: false });
        this.props.message({ error: err.toString() });
      });
  }

  handleRemove(id) {
    const payload = { id };
    const authorizationHeader = 'bearer '.concat(Auth.getToken());
    Axios.post('/api/expenses/remove', payload, { headers: { Authorization: authorizationHeader } })
      .then(() => this.props.message({ success: 'Removed Expense' }))
      .catch(err => this.props.message({ error: err.toString() }));
  }

  handleEdit(n) {
    this.setState({
      keyEditExpense: Math.random(),
      expenseObjectToEdit: this.state.expenses[n],
    });
  }

  handleMessage(k, m) {
    // if user cancelled
    if (m.cancel) { this.setState({ keyEditExpense: null }); }
    if (m.success) { this.setState({ keyEditExpense: null }); this.props.message(m); }
  }

  render() {
    const EditExpenseView = this.state.keyEditExpense ?
      (
        <EditExpense
          key={this.state.keyEditExpense}
          message={message => this.handleMessage(this.state.keyEditExpense, message)}
          expenseObject={this.state.expenseObjectToEdit}
        />
      ) :
        <p>Nothing to Edit</p>;

    if (this.state.loading) return <LoadingView />;
    return (
      <div>
        <ExpensesListTable
          key={this.state.key}
          expenses={this.state.expenses}
          onRemove={id => this.handleRemove(id)}
          onEdit={n => this.handleEdit(n)}
        />
        {EditExpenseView}
      </div>
    );
  }
}

export default ExpensesList;
