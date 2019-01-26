import React from 'react';
import Axios from 'axios';
import Auth from '../utils/Auth';
import { LoadingView } from './LoadingView';
import { SummaryTable } from './SummaryTable';

export class Summary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      expenses: null,
      summary: [],
    };
  }

  componentDidMount() {
    const authorizationHeader = 'bearer '.concat(Auth.getToken());
    Axios.get('/api/expenses/all', { headers: { Authorization: authorizationHeader } })
      .then((response) => {
        const { data } = response;
        this.setState({ loading: false, expenses: data });
        this.organize();
      })
      .catch((err) => {
        this.setState({ loading: false });
        this.props.message({ error: err.toString() });
      });
  }

  organize() {
    const expensesAttention = [];
    const summary = this.state.expenses.reduce((acc, exp) => {
      const newAcc = acc;
      const name = exp.paidBy.name === '' ? '(blank)' : exp.paidBy.name;

      const namePresent = acc[name] !== undefined;
      if (!namePresent) newAcc[name] = { name, paid: 0, owe: 0 };
      newAcc[name] = {
        ...newAcc[name],
        paid: exp.amount + acc[name].paid,
      };
      // split by
      const count = exp.splitBy.length;
      const each = exp.amount / count;
      exp.splitBy.forEach((split) => {
        const namePresentSplit = acc[split.name] !== undefined;
        if (!namePresentSplit) newAcc[split.name] = { name: split.name, paid: 0, owe: 0 };
        newAcc[split.name] = {
          ...newAcc[split.name],
          owe: each + acc[split.name].owe,
        };
      });

      // check for expenses that need attention
      if (name === '(blank)' || count === 0) expensesAttention.push(exp);

      return newAcc;
    }, {});

    this.setState({ summary });
    if (expensesAttention.length > 0) this.props.expensesAttention(expensesAttention);
  }

  render() {
    if (this.state.loading) return <LoadingView />;
    return (
      <div>
        <h3>Summary</h3>
        <SummaryTable summary={this.state.summary} />
      </div>
    );
  }
}

export default Summary;
