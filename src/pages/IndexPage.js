import React from 'react';
import { NewExpense } from '../components/NewExpense';
import { ExpensesList } from '../components/ExpensesList';
import { ErrorView } from '../components/ErrorView';
import { SuccessView } from '../components/SuccessView';

export class IndexPage extends React.Component {
  constructor() {
    super();

    this.state = {
      keyNewExpense: Math.random(),
      keyExpenseList: Math.random(),
    };
  }

  handleMessage(k, m) {
    // display message
    this.setState({ ...m });

    // if success message came from New Expense, reset both, otherwise just the one it came from
    if (m.success && k === this.state.keyNewExpense) {
      this.setState({
        keyNewExpense: Math.random(),
        keyExpenseList: Math.random(),
      });
    }
    if (m.success && k === this.state.keyExpenseList) {
      this.setState({
        keyExpenseList: Math.random(),
      });
    }
  }

  render() {
    return (
      <div className="home">
        <h1>Trip Name</h1>
        <ErrorView error={this.state.error} />
        <SuccessView msg={this.state.success} />
        <NewExpense
          key={this.state.keyNewExpense}
          message={message => this.handleMessage(this.state.keyNewExpense, message)}
        />
        <ExpensesList
          key={this.state.keyExpenseList}
          message={message => this.handleMessage(this.state.keyExpenseList, message)}
        />
      </div>
    );
  }
}

export default IndexPage;
