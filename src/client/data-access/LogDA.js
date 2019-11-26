import React from 'react';
import Axios from 'axios';
import Auth from '../utils/Auth';
import { LoadingView } from '../components/LoadingView';
import { LogView } from '../components/LogView';

export class Log extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authorizationHeader: Auth.getToken()
        ? 'bearer '.concat(Auth.getToken())
        : null,
      log: [],
      tripId: props.tripId || null,
    };
  }

  componentDidMount() {
    if (this.state.tripId) this.getLogs();
  }

  getLogs() {
    Axios.get('/api/log/recent', {
      headers: {
        Authorization: this.state.authorizationHeader,
      },
      params: { tripId: this.state.tripId },
    })
      .then((response) => {
        const { data } = response;
        this.setState({ loading: false, log: data });
      })
      .catch((err) => {
        this.setState({ loading: false });
        if (this.props.message) {
          this.props.message({ text: err.toString(), variant: 'error' });
        } else throw err;
      });
  }

  handleClick(id) {
    Axios.get('/api/expenses/getone', {
      headers: {
        Authorization: this.state.authorizationHeader,
      },
      params: { id },
    })
      .then((response) => {
        const { data } = response;
        this.props.onView(data);
      })
      .catch((err) => {
        if (this.props.message) {
          this.props.message({ text: err.toString(), variant: 'error' });
        } else throw err;
      });
  }

  render() {
    if (this.state.loading) return <LoadingView />;
    return this.state.log.length > 0 ? (
      <div>
        <LogView log={this.state.log} onClick={id => this.handleClick(id)} />
      </div>
    ) : (
      <div>No Activity</div>
    );
  }
}

export default Log;
