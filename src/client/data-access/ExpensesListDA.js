import React from 'react';
import Axios from 'axios';
import Auth from '../utils/Auth';
import { LoadingView } from '../components/LoadingView';
import { ExpensesListView } from '../components/ExpensesListView';

export class ExpensesList extends React.Component {
  constructor(props) {
    super(props);

    const { expenses } = props;
    const tripId = props.tripId || null;

    this.state = {
      loading: expenses === undefined,
      expenses: expenses || null,
      tripId,
      apiEndpoint: props.apiEndpoint || 'recent',
    };
  }

  componentDidMount() {
    if (this.state.expenses === null) this.getExpenses();
  }

  getExpenses() {
    if (this.state.tripId) {
      const authorizationHeader = 'bearer '.concat(Auth.getToken());
      Axios.get('/api/expenses/'.concat(this.state.apiEndpoint), {
        headers: {
          Authorization: authorizationHeader,
        },
        params: { id: this.state.tripId },
      })
        .then((response) => {
          const { data } = response;
          this.setState({ loading: false, expenses: data });
        })
        .catch((err) => {
          this.setState({ loading: false });
          if (this.props.message) this.props.message({ error: err.toString() });
          else throw err;
        });
    }
  }

  handleEdit(n) {
    // remove active from the others and disable buttons
    const expenses = this.state.expenses.map(e => ({
      ...e,
      buttonsDisabled: true,
      active: false,
    }));
    expenses[n].active = true;

    this.setState({
      expenses,
    });
    this.props.onEdit(this.state.expenses[n]);
  }

  render() {
    const ExpenseListTable =
      this.state.expenses !== null && this.state.expenses.length > 0 ? (
        <div>
          <ExpensesListView
            expenses={this.state.expenses}
            onEdit={n => this.handleEdit(n)}
          />
        </div>
      ) : (
        <div />
      );

    if (this.state.loading) return <LoadingView />;
    return ExpenseListTable;
  }
}

export default ExpensesList;
