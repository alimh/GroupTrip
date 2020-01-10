import React from 'react';
import Axios from 'axios';
import { LoggedOutMessage } from '../components/LoggedOutMessage';
import { ExpenseForm } from '../components/ExpenseForm';
import { LoadingView } from '../components/LoadingView';

import MessageContext, { ErrToMessageObj } from '../components/MessageContext';

export class ExpenseDetail extends React.Component {
  static contextType = MessageContext;

  static getDerivedStateFromProps(nextProps, prevState) {
    return prevState.preventScrub ? {} : nextProps;
  }

  constructor(props) {
    super(props);

    const tripId = props.tripId || null;
    const expenseObj = props.expenseObj || null;
    const tripObj = props.tripObj || null;
    const borderVariant = props.borderVariant || null;

    this.state = {
      loading: true,
      tripObj,
      tripId,
      expenseObj,
      borderVariant
    };
  }

  componentDidMount() {
    if (this.state.tripId) {
      Axios.get('/api/trips/get', {
        params: { id: this.state.tripId }
      })
        .then((response) => {
          const { data } = response;
          this.setState({ loading: false, tripObj: data });
        })
        .catch((err) => {
          this.setState({ loading: false });
          this.context.sendMessage({
            text:
              err.response.status === 401
                ? LoggedOutMessage()
                : err.response.data,
            variant: 'error'
          });
        });
    } else {
      this.context.sendMessage({ text: 'Trip ID not valid', variant: 'error' });
    }
  }

  handleSave(expenseObj) {
    const payload = {
      ...expenseObj,
      tripId: this.state.tripId,
      id: this.state.expenseObj ? this.state.expenseObj.id : null
    };

    // this.setState({ loading: true });
    this.props.message({ text: 'Saving...' });

    const newExpenseObj = {
      ...this.state.expenseObj,
      ...expenseObj,
      category: {
        name: expenseObj.category.value,
        id: expenseObj.category.key
      },
      paidBy: {
        name: expenseObj.paidBy.value,
        id: expenseObj.paidBy.key
      }
    };
    this.setState({
      expenseObj: newExpenseObj
    });
    Axios.post('/api/expenses/save', payload)
      .then(() => {
        this.props.message({ text: 'Saved', variant: 'success' });
        // this.setState({ loading: false });
        // had to comment because component is being destroyed on .message
      })
      .catch(err => this.props.message(ErrToMessageObj(err)));
  }

  handleRemove() {
    const payload = { id: this.state.expenseObj.id };
    this.props.message({ text: 'Removing...' });
    this.setState({ tripObj: null });
    Axios.post('/api/expenses/remove', payload)
      .then(() => {
        this.props.message({
          text: 'Removed Expense',
          variant: 'success'
        });
      })
      .catch(err => this.props.message(ErrToMessageObj(err)));
  }

  handleCancel() {
    this.setState({ keyExpenseForm: Math.random() });
    if (this.props.onCancel) this.props.onCancel();
  }

  render() {
    if (this.state.loading) return <LoadingView />;
    return this.state.tripObj ? (
      <ExpenseForm
        key={this.state.keyExpenseForm}
        categories={this.state.tripObj.categories || []}
        travelers={this.state.tripObj.travelers || []}
        expenseObj={this.state.expenseObj}
        onSave={expenseObject => this.handleSave(expenseObject)}
        onCancel={() => this.handleCancel()}
        onRemove={() => this.handleRemove()}
        borderVariant={this.state.borderVariant}
      />
    ) : (
      <div />
    );
  }
}

export default ExpenseDetail;
