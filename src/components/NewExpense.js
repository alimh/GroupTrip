import React from 'react';
import Axios from 'axios';
import Auth from '../utils/Auth';
import { LoadingView } from '../components/LoadingView';
import { ExpenseForm } from './ExpenseForm';

export class NewExpense extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      settingsValues: null,
      key: Math.random(),
    };
  }

  componentDidMount() {
    this.getSettings();
  }

  getSettings() {
    const authorizationHeader = 'bearer '.concat(Auth.getToken());
    Axios.get('/api/settings/all', { headers: { Authorization: authorizationHeader } })
      .then((response) => {
        const { data } = response;
        this.setState({ loading: false, settingsValues: data });
      })
      .catch((err) => {
        this.setState({ loading: false });
        this.props.message({ error: err.toString() });
      });
  }

  handleSave(expenseObject) {
    const payload = expenseObject;
    const authorizationHeader = 'bearer '.concat(Auth.getToken());
    Axios.post('/api/expenses/new', payload, { headers: { Authorization: authorizationHeader } })
      .then(() => this.props.message({ success: 'Added Expense' }))
      .catch(err => this.props.message({ error: err.toString() }));
  }

  handleCancel() {
    this.setState({ key: Math.random() });
  }

  render() {
    if (this.state.loading) return <LoadingView />;
    return (
      <div>
        <h1>New Expense</h1>
        <ExpenseForm
          key={this.state.key}
          users={this.state.settingsValues.Users}
          categories={this.state.settingsValues.Categories}
          onSave={expenseObject => this.handleSave(expenseObject)}
          onCancel={() => this.handleCancel()}
        />
      </div>
    );
  }
}

export default NewExpense;
