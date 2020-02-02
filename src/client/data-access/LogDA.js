import React from 'react';
import Axios from 'axios';
import { LoadingView } from '../components/LoadingView';
import { LogView } from '../components/LogView';

import MessageContext, { ErrToMessageObj } from '../components/MessageContext';

export class Log extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      log: [],
      tripId: props.tripId || null,
      showAll: false,
    };
  }

  componentDidMount() {
    const { tripId } = this.state;
    if (tripId) this.getLogs(false);
  }

  getLogs(all) {
    const { tripId } = this.state;
    const { sendMessage } = this.context;

    const apiEndPoint = all ? 'all' : 'recent';

    Axios.get('/api/log/'.concat(apiEndPoint), {
      params: { tripId },
    })
      .then((response) => {
        const { data } = response;
        this.setState({ loading: false, log: data });
      })
      .catch((err) => {
        this.setState({ loading: false });
        sendMessage(ErrToMessageObj(err));
      });
  }

  handleClick(id) {
    const { onView } = this.props;
    const { sendMessage } = this.context;

    Axios.get('/api/expenses/getone', {
      params: { id },
    })
      .then((response) => {
        const { data } = response;
        onView(data);
      })
      .catch((err) => sendMessage(ErrToMessageObj(err)));
  }

  handleShowAll() {
    this.setState(() => ({ showAll: true }));
    this.getLogs(true);
  }

  render() {
    const { loading, log, showAll } = this.state;

    if (loading) return <LoadingView />;
    return log.length > 0
      ? (
        <LogView
          log={log}
          onClick={(id) => this.handleClick(id)}
          onShowAll={() => this.handleShowAll()}
          isAll={showAll}
        />
      )
      : (
        <div>No Activity</div>
      );
  }
}

Log.contextType = MessageContext;

export default Log;
