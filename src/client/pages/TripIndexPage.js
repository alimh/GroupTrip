import React from 'react';
import { SuccessView } from '../components/SuccessView';
import { ErrorView } from '../components/ErrorView';
import { TripLinks } from '../components/TripLinks';
import { ExpenseDetail } from '../data-access/ExpenseDetailDA';
import { ExpensesList } from '../data-access/ExpensesListDA';

export class TripIndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tripId: props.tripId || null,
      tripObj: props.tripObj || null,
      keyNewExpense: Math.random(),
      keyExpenseList: Math.random(),
      messages: {
        success: null,
        error: null,
      },
    };
  }

  handleMessage(k, m) {
    // display message
    this.setState({ messages: m });

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
    console.log(this.state);
    return (
      <div className="home">
        <TripLinks tripId={this.state.tripId} />
        <ErrorView error={this.state.messages.error} />
        <SuccessView msg={this.state.messages.success} />

        <div>
          <div>
            <ExpenseDetail
              key={this.state.keyNewExpense}
              tripId={this.state.tripId}
              message={message =>
                this.handleMessage(this.state.keyNewExpense, message)
              }
            />
          </div>
          <div>
            <ExpensesList
              key={this.state.keyExpenseList}
              tripId={this.state.tripId}
              message={message =>
                this.handleMessage(this.state.keyExpenseList, message)
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TripIndexPage;
