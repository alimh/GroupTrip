import React from 'react';
import Axios from 'axios';
import Auth from '../utils/Auth';
import { ExpenseForm } from '../components/ExpenseForm';
import { LoadingView } from '../components/LoadingView';

export class ExpenseDetail extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    return nextProps;
  }

  constructor(props) {
    super(props);

    const tripId = props.tripId || null;
    const expenseObj = props.expenseObj || null;
    const tripObj = props.tripObj || null;
    const borderVariant = props.borderVariant || null;

    this.state = {
      loading: true,
      authorizationHeader: Auth.getToken()
        ? 'bearer '.concat(Auth.getToken())
        : null,
      tripObj,
      tripId,
      expenseObj,
      borderVariant,
    };
  }

  componentDidMount() {
    if (this.state.tripId) {
      Axios.get('/api/trips/get', {
        headers: {
          Authorization: this.state.authorizationHeader,
        },
        params: { id: this.state.tripId },
      })
        .then((response) => {
          const { data } = response;
          this.setState({ loading: false, tripObj: data });
        })
        .catch((err) => {
          this.setState({ loading: false });
          this.props.message({ error: err.toString() });
        });
    } else {
      this.props.message({ error: 'Trip ID not valid' });
    }
  }

  handleSave(expenseObject) {
    const payload = {
      ...expenseObject,
      tripId: this.state.tripId,
      id: this.state.expenseObj ? this.state.expenseObj.id : null,
      owner: Auth.getToken(),
    };

    this.setState({ loading: true });
    Axios.post('/api/expenses/save', payload, {
      headers: { Authorization: this.state.authorizationHeader },
    })
      .then(() => {
        this.props.message({ success: 'Saved' });
      })
      .catch((err) => {
        this.props.message({ error: err.toString() });
        this.handleCancel();
      });
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
        borderVariant={this.state.borderVariant}
      />
    ) : (
      <div />
    );
  }
}

export default ExpenseDetail;
