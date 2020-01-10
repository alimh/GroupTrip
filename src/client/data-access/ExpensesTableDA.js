import React from 'react';
import Axios from 'axios';
import { LoadingView } from '../components/LoadingView';
import { ExpensesTableView } from '../components/ExpensesTableView';

import MessageContext, { ErrToMessageObj } from '../components/MessageContext';

export class ExpensesTable extends React.Component {
  static contextType = MessageContext;

  constructor(props) {
    super(props);

    const { expenses } = props;
    const tripId = props.tripId || null;

    this.state = {
      loading: expenses === undefined,
      expenses: expenses || null,
      tripId,
      apiEndpoint: 'all'
    };
  }

  componentDidMount() {
    this.getExpenses();
  }

  getExpenses() {
    if (this.state.tripId) {
      Axios.get('/api/expenses/'.concat(this.state.apiEndpoint), {
        params: { id: this.state.tripId }
      })
        .then((response) => {
          const { data } = response;
          this.setState({ loading: false, expenses: data });
        })
        .catch((err) => {
          this.setState({ loading: false });
          this.context.sendMessage(ErrToMessageObj(err));
        });
    }
  }

  handleEdit(n) {
    // remove active from the others and disable buttons
    const expenses = this.state.expenses.map(e => ({
      ...e,
      buttonsDisabled: true,
      active: false
    }));
    expenses[n].active = true;

    this.setState({
      expenses
    });
    this.props.onEdit(this.state.expenses[n]);
  }

  render() {
    const TableView =
      this.state.expenses !== null && this.state.expenses.length > 0 ? (
        <div>
          <ExpensesTableView
            expenses={this.state.expenses}
            onRemove={id => this.showRemoveDialog(id)}
            onEdit={n => this.handleEdit(n)}
          />
        </div>
      ) : (
        <div />
      );

    if (this.state.loading) return <LoadingView />;
    return TableView;
  }
}

export default ExpensesTable;
