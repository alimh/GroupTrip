import React from 'react';
import { Summary } from '../components/Summary';
import { ExpensesList } from '../components/ExpensesList';
import { ErrorView } from '../components/ErrorView';
import { SuccessView } from '../components/SuccessView';

export class SummaryPage extends React.Component {
  constructor() {
    super();

    this.state = {
      keySummary: Math.random(),
      keyExpenseList: null,
      expenses: null,
    };
  }

  handleMessage(k, m) {
    // display message
    this.setState({ ...m });

    // if success message came from New Expense, reset both, otherwise just the one it came from
    if (m.success && k === this.state.keyExpenseList) {
      this.setState({
        keySummary: Math.random(),
      });
    }
  }

  receiveExpenses(expenses) {
    this.setState({ expenses, keyExpenseList: Math.random() });
  }

  render() {
    return (
      <div className="home">
        <h1>Trip Name</h1>
        <ErrorView error={this.state.error} />
        <SuccessView msg={this.state.success} />
        <Summary
          key={this.state.keySummary}
          message={message => this.handleMessage(this.state.keyNewExpense, message)}
          expensesAttention={expenses => this.receiveExpenses(expenses)}
        />
        {
          this.state.keyExpenseList !== null ? (
            <div>
              <h2>Items that require attention</h2>
              <ExpensesList
                key={this.state.keyExpenseList}
                message={message => this.handleMessage(this.state.keyExpenseList, message)}
                expenses={this.state.expenses}
              />
            </div>
          ) : <div />
        }
      </div>
    );
  }
}

export default SummaryPage;
