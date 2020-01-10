import React from 'react';
import Axios from 'axios';
import { LoadingView } from '../components/LoadingView';
import { LogView } from '../components/LogView';

import MessageContext, { ErrToMessageObj } from '../components/MessageContext';

export class Log extends React.Component {
  static contextType = MessageContext;

  constructor(props) {
    super(props);

    this.state = {
      log: [],
      tripId: props.tripId || null
    };
  }

  componentDidMount() {
    if (this.state.tripId) this.getLogs();
  }

  getLogs() {
    Axios.get('/api/log/recent', {
      params: { tripId: this.state.tripId }
    })
      .then((response) => {
        const { data } = response;
        this.setState({ loading: false, log: data });
      })
      .catch((err) => {
        this.setState({ loading: false });
        this.context.sendMessage(ErrToMessageObj(err));
      });
  }

  handleClick(id) {
    Axios.get('/api/expenses/getone', {
      params: { id }
    })
      .then((response) => {
        const { data } = response;
        this.props.onView(data);
      })
      .catch(err => this.context.sendMessage(ErrToMessageObj(err)));
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
