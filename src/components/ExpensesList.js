import React from 'react';
import Axios from 'axios';
import Auth from '../utils/Auth';
import { LoadingView } from '../components/LoadingView';
import { ExpensesListTable } from './ExpensesListTable';

export class ExpensesList extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      expenses: null,
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

  render() {
    if (this.state.loading) return <LoadingView />;
    return (
      <div>
        <ExpensesListTable
          key={this.state.key}
          expenses={this.state.expenses}
          onRemove={id => this.handleRemove(id)}
        />
      </div>
    );
  }
}

export default ExpensesList;
