import React from 'react';
import Axios from 'axios';
import { LoggedOutMessage } from '../components/LoggedOutMessage';
import { ExpenseForm } from '../components/ExpenseForm';
import { LoadingView } from '../components/LoadingView';
import { ErrToMessageObj } from '../components/MessageContext';

export class ExpenseDetail extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    return prevState.preventScrub ? {} : nextProps;
  }

  constructor(props) {
    super(props);

    const {
      tripId = null, expenseObj = {}, tripObj = null, borderVariant = null,
    } = props;

    this.state = {
      loading: true,
      tripObj,
      tripId,
      expenseObj,
      borderVariant,
    };
  }

  componentDidMount() {
    const { tripId } = this.state;
    const { message } = this.props;

    if (tripId) {
      Axios.get('/api/trips/get', {
        params: { id: tripId },
      })
        .then((response) => {
          const { data } = response;
          this.setState({ loading: false, tripObj: data });
        })
        .catch((err) => {
          this.setState({ loading: false });
          message({
            text:
              err.response.status === 401
                ? LoggedOutMessage()
                : err.response.data,
            variant: 'error',
          });
        });
    } else {
      message({ text: 'Trip ID not valid', variant: 'error' });
    }
  }

  handleSave(incomingExpenseObj) {
    const { tripId, expenseObj = {} } = this.state;
    const { id = null } = incomingExpenseObj;
    const { message } = this.props;

    const payload = {
      ...incomingExpenseObj,
      tripId,
      id,
    };

    message({ text: 'Saving...' });

    const newExpenseObj = {
      ...expenseObj,
      ...incomingExpenseObj,
      category: {
        name: incomingExpenseObj.category.value,
        id: incomingExpenseObj.category.key,
      },
      paidBy: {
        name: incomingExpenseObj.paidBy.value,
        id: incomingExpenseObj.paidBy.key,
      },
    };
    this.setState({
      expenseObj: newExpenseObj,
    });

    Axios.post('/api/expenses/save', payload)
      .then(() => {
        message({ text: 'Saved', variant: 'success' });
      })
      .catch((err) => message(ErrToMessageObj(err)));
  }

  handleRemove() {
    const { expenseObj } = this.state;
    const { message } = this.props;

    const payload = { id: expenseObj.id };
    message({ text: 'Removing...' });
    this.setState({ tripObj: null });
    Axios.post('/api/expenses/remove', payload)
      .then(() => {
        message({
          text: 'Removed Expense',
          variant: 'success',
        });
      })
      .catch((err) => message(ErrToMessageObj(err)));
  }

  handleCancel() {
    const { onCancel = () => false } = this.props;

    this.setState({ keyExpenseForm: Math.random() });
    onCancel();
  }

  render() {
    const {
      loading, tripObj, keyExpenseForm, expenseObj, borderVariant,
    } = this.state;

    if (loading) return <LoadingView />;
    return tripObj
      ? (
        <ExpenseForm
          key={keyExpenseForm}
          categories={tripObj.categories || []}
          travelers={tripObj.travelers || []}
          expenseObj={expenseObj}
          onSave={(expObj) => this.handleSave(expObj)}
          onCancel={() => this.handleCancel()}
          onRemove={() => this.handleRemove()}
          borderVariant={borderVariant}
        />
      )
      : (
        <div />
      );
  }
}

export default ExpenseDetail;
