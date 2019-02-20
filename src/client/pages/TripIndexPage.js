import React from 'react';
import { SuccessView } from '../components/SuccessView';
import { ErrorView } from '../components/ErrorView';
import { TripLinks } from '../components/TripLinks';
import { NewExpense } from '../data-access/NewExpense';
import { ExpensesList } from '../data-access/ExpensesListDA';

export class TripIndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
    console.log('Trip Index Page');
    console.log(this.state.tripObj);
    return (
      <div className="home">
        <TripLinks tripId={this.state.tripObj.id} />
        <ErrorView error={this.state.messages.error} />
        <SuccessView msg={this.state.messages.success} />

        <div>
          <h3>{this.state.tripObj.name}</h3>
          <div>
            <NewExpense
              tripId={this.state.tripObj.id}
              categories={this.state.tripObj.categories}
              travelers={this.state.tripObj.travelers}
              key={this.state.keyNewExpense}
              message={message =>
                this.handleMessage(this.state.keyNewExpense, message)
              }
            />
          </div>
          <div>
            <ExpensesList
              key={this.state.keyExpenseList}
              tripId={this.state.tripObj.id}
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
