import React from 'react';
import Axios from 'axios';
import Auth from '../utils/Auth';
import { ExpenseForm } from '../components/ExpenseForm';

export class NewExpense extends React.Component {
  constructor() {
    super();
    /* props
      id: String, id of trip that new expense will save to
    */
    this.state = {
      key: Math.random(),
    };
  }

  handleSave(expenseObject) {
    const payload = expenseObject;
    const authorizationHeader = 'bearer '.concat(Auth.getToken());
    Axios.post('/api/expenses/new', payload, {
      headers: { Authorization: authorizationHeader },
    })
      .then(() => this.props.message({ success: 'Added Expense' }))
      .catch(err => this.props.message({ error: err.toString() }));
  }

  handleCancel() {
    this.setState({ key: Math.random() });
  }

  render() {
    console.log('rendering newexpense');
    console.log(this.props);
    return (
      <div>
        <h3>New Expense</h3>
        <ExpenseForm
          key={this.state.key}
          users={this.props.travelers}
          categories={this.props.categories}
          onSave={expenseObject => this.handleSave(expenseObject)}
          onCancel={() => this.handleCancel()}
        />
      </div>
    );
  }
}

export default NewExpense;
