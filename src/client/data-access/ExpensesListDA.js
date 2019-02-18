import React from 'react';
import Axios from 'axios';
import Auth from '../utils/Auth';
import { LoadingView } from '../components/LoadingView';
import { ExpensesListTable } from '../components/ExpensesListTable';
import { EditExpense } from '../components/EditExpense';

export class ExpensesList extends React.Component {
  constructor(props) {
    super(props);

    const { expenses } = props;
    const tripId = props.tripId || null;

    this.state = {
      key: Math.random(),
      keyEditExpense: null,
      loading: expenses === undefined,
      expenses: expenses || null,
      expenseObjectToEdit: null,
      tripId,
    };
  }

  componentDidMount() {
    console.log(this.state);
    if (this.state.expenses === null) this.getExpenses();
  }

  getExpenses() {
    if (this.state.tripId) {
      const authorizationHeader = 'bearer '.concat(Auth.getToken());
      Axios.get('/api/expenses/all', {
        headers: {
          Authorization: authorizationHeader,
        },
        params: { id: this.state.tripId },
      })
        .then((response) => {
          const { data } = response;
          console.log('then response');
          console.log(data);
          this.setState({ loading: false, expenses: data });
        })
        .catch((err) => {
          this.setState({ loading: false });
          console.log('catch repsone');
          console.log(err);
          this.props.message({ error: err.toString() });
        });
    }
  }

  handleRemove(id) {
    const payload = { id };
    const authorizationHeader = 'bearer '.concat(Auth.getToken());
    Axios.post('/api/expenses/remove', payload, {
      headers: { Authorization: authorizationHeader },
    })
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
    if (m.cancel) {
      this.setState({ keyEditExpense: null });
    }
    if (m.success) {
      this.setState({ keyEditExpense: null });
      this.props.message(m);
    }
  }

  render() {
    const EditExpenseView = this.state.keyEditExpense ? (
      <EditExpense
        key={this.state.keyEditExpense}
        message={message =>
          this.handleMessage(this.state.keyEditExpense, message)
        }
        expenseObject={this.state.expenseObjectToEdit}
      />
    ) : (
      <div />
    );

    if (this.state.loading) return <LoadingView />;
    return this.state.expenses.length > 0 ? (
      <div>
        <h3>Expense List</h3>
        <ExpensesListTable
          key={this.state.key}
          expenses={this.state.expenses}
          onRemove={id => this.handleRemove(id)}
          onEdit={n => this.handleEdit(n)}
        />
        {EditExpenseView}
      </div>
    ) : (
      <div />
    );
  }
}

export default ExpensesList;
