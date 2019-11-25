import React from 'react';
import Axios from 'axios';
import Auth from '../utils/Auth';
import { LoadingView } from '../components/LoadingView';
import { SummaryTable } from '../components/SummaryTable';
import { PaybackList } from '../components/PaybackList';

export class ExpenseSummaryDA extends React.Component {
  constructor(props) {
    super(props);

    const tripId = props.tripId || null;

    this.state = {
      loading: true,
      tripId,
      expenses: [],
      summary: [],
      paybackLog: [],
      expensesAttention: [],
    };
  }

  componentDidMount() {
    const authorizationHeader = 'bearer '.concat(Auth.getToken());
    Axios.get('/api/expenses/all', {
      headers: { Authorization: authorizationHeader },
      params: { id: this.state.tripId },
    })
      .then((response) => {
        const { data } = response;
        this.setState({ loading: false, expenses: data });
        this.organize();
        this.createPaybackLog();
      })
      .catch((err) => {
        this.setState({ loading: false });
        if (this.props.message) this.props.message({ error: err.toString() });
        else throw err;
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
        if (!namePresentSplit) {
          newAcc[split.name] = { name: split.name, paid: 0, owe: 0 };
        }
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
    if (expensesAttention.length > 0) {
      this.setState({ expensesAttention });
    }
  }

  createPaybackLog() {
    const P = []; // positives
    const N = []; // negatives
    const L = []; // log
    Object.keys(this.state.summary).forEach((e) => {
      const { name } = this.state.summary[e];
      const f = this.state.summary[e].paid - this.state.summary[e].owe;
      if (f > 0) {
        P.push({ name, owe: f });
      }
      if (f < 0) {
        N.push({ name, owe: f * -1 });
      }
    });
    const compareVals = (v, S, m = 0) => {
      const T = [];
      S.forEach((i, n) => {
        if (v - i < 1 && v - i >= 0) {
          T[n] = [n + m];
        }
        if (v - i >= 1) {
          const R =
            S.length === 1
              ? false
              : compareVals(v - i, S.slice(n + 1), n + 1 + m);
          if (R !== false) {
            T[n] = R;
            T[n].push(n + m);
          }
        }
      });
      let longest = 0;
      let c = null;
      T.forEach((a, n) => {
        if (a.length > longest) {
          longest = a.length;
          c = n;
        }
      });
      return c !== null ? T[c] : false;
    };

    while (P.length > 0 && N.length > 0) {
      P.sort((a, b) => b.owe - a.owe);
      N.sort((a, b) => b.owe - a.owe);
      let I = [];
      if (N[0].owe > P[0].owe) {
        I = compareVals(N[0].owe, P.map(a => a.owe));
        if (I.length > 0) {
          I.forEach((a) => {
            const pSplice = P.splice(a, 1)[0];
            L.push({
              pay: N[0].name,
              receive: pSplice.name,
              amount: pSplice.owe,
            });
          });
          N.splice(0, 1);
        } else {
          L.push({ pay: N[0].name, receive: P[0].name, amount: P[0].owe });
          N[0].owe -= P[0].owe;
          P.shift();
        }
      } else {
        I = compareVals(P[0].owe, N.map(a => a.owe));
        if (I.length > 0) {
          I.forEach((a) => {
            const nSplice = N.splice(a, 1)[0];
            L.push({
              pay: nSplice.name,
              receive: P[0].name,
              amount: nSplice.owe,
            });
          });
          P.splice(0, 1);
        } else {
          L.push({
            pay: N[0].name,
            receive: P[0].name,
            amount: N[0].owe,
          });
          P[0].owe -= N[0].owe;
          N.shift();
        }
      }
    }
    this.setState({
      paybackLog: L.map((i, n) => ({ ...i, id: n })),
    });
  }

  render() {
    if (this.state.loading) return <LoadingView />;
    return (
      <div>
        <SummaryTable summary={this.state.summary} />
        <br />
        <PaybackList paybackList={this.state.paybackLog} />
      </div>
    );
  }
}

export default ExpenseSummaryDA;
