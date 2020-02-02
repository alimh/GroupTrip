import React from 'react';
import Axios from 'axios';
import { LoadingView } from '../components/LoadingView';
import { ExpensesListView } from '../components/ExpensesListView';

import MessageContext, { ErrToMessageObj } from '../components/MessageContext';

export class ExpensesList extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.active && prevState.active) {
      // remove active from the others and disable buttons
      const expenses = prevState.expenses.map((e) => ({
        ...e,
        buttonsDisabled: true,
        active: false,
      }));

      return { ...nextProps, expenses };
    }
    return nextProps;
  }

  constructor(props) {
    super(props);

    const { expenses } = props;
    const tripId = props.tripId || null;

    const blankFunc = () => true;

    this.state = {
      loading: expenses === undefined,
      expenses: expenses || null,
      tripId,
      apiEndpoint: props.apiEndpoint || 'recent',
      active: false,
      sendExpenses: props.getExpenses || blankFunc,
    };
  }

  componentDidMount() {
    const { expenses } = this.state;
    if (expenses === null) this.getExpenses();
  }

  getExpenses() {
    const { tripId, apiEndpoint, sendExpenses } = this.state;
    const { sendMessage } = this.context;

    if (tripId) {
      Axios.get('/api/expenses/'.concat(apiEndpoint), {
        params: { id: tripId },
      })
        .then((response) => {
          const { data } = response;
          this.setState({ loading: false, expenses: data });
          sendExpenses(data);
        })
        .catch((err) => {
          this.setState({ loading: false });
          sendMessage(ErrToMessageObj(err));
        });
    }
  }

  handleEdit(n) {
    const { expenses } = this.state;
    const { onEdit } = this.props;
    // remove active from the others and disable buttons
    const expensesMapped = expenses.map((e) => ({
      ...e,
      buttonsDisabled: true,
      active: false,
    }));
    expensesMapped[n].active = true;

    this.setState({
      expenses: expensesMapped,
      active: true,
    });
    onEdit(expenses[n]);
  }

  render() {
    const { expenses, loading, tripId } = this.state;
    const ExpenseListTable = expenses !== null && expenses.length > 0
      ? (
        <>
          <ExpensesListView
            tripId={tripId}
            expenses={expenses}
            onEdit={(n) => this.handleEdit(n)}
          />
        </>
      )
      : (
        <div />
      );

    if (loading) return <LoadingView />;
    return ExpenseListTable;
  }
}

ExpensesList.contextType = MessageContext;

export default ExpensesList;
