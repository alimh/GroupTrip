import React from 'react';
import Axios from 'axios';
import Auth from '../utils/Auth';
import { LoadingView } from './LoadingView';
import { ExpenseForm } from './ExpenseForm';

export class EditExpense extends React.Component {
  constructor(props) {
    super(props);

    const { expenseObject } = props;

    this.state = {
      loading: true,
      settingsValues: null,
      expenseObject,
      key: expenseObject.id,
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
    const payload = { ...expenseObject, id: this.state.key };
    const authorizationHeader = 'bearer '.concat(Auth.getToken());
    Axios.post('/api/expenses/update', payload, { headers: { Authorization: authorizationHeader } })
      .then(() => this.props.message({ success: 'Updated Expense' }))
      .catch(err => this.props.message({ error: err.toString() }));
  }

  handleCancel() {
    this.props.message({ cancel: 'Cancelled by user' });
  }

  render() {
    if (this.state.loading) return <LoadingView />;
    return (
      <div>
        <h3>Edit Expense</h3>
        <ExpenseForm
          key={this.state.key}
          users={this.state.settingsValues.Users}
          categories={this.state.settingsValues.Categories}
          date={this.state.expenseObject.date}
          note={this.state.expenseObject.note}
          amount={this.state.expenseObject.amount}
          category={this.state.expenseObject.category}
          splitBy={this.state.expenseObject.splitBy}
          paidBy={this.state.expenseObject.paidBy}
          onSave={expenseObject => this.handleSave(expenseObject)}
          onCancel={() => this.handleCancel()}
        />
      </div>
    );
  }
}

export default EditExpense;
