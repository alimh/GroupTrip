import React from 'react';
import Axios from 'axios';
import { TripLinksBanner } from '../components/TripLinksBanner';
import { LoadingView } from '../components/LoadingView';
import { LoggedOutMessage } from '../components/LoggedOutMessage';

import MessageContext from '../components/MessageContext';

export class TripLinks extends React.Component {
  static contextType = MessageContext;

  constructor(props) {
    super(props);

    const tripId = props.tripId || null;

    this.state = {
      loading: true,
      tripId,
      tripName: null
    };
  }

  componentDidMount() {
    if (this.state.tripId) {
      Axios.get('/api/trips/getName', {
        params: { id: this.state.tripId }
      })
        .then((response) => {
          const { data } = response;
          this.setState({
            loading: false,
            tripName: data.name,
            isOwner: data.isOwner
          });
          this.props.onSuccess();
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
    }
  }

  render() {
    if (this.state.loading) return <LoadingView />;
    return (
      <TripLinksBanner
        tripId={this.state.tripId}
        tripName={this.state.tripName}
        isOwner={this.state.isOwner}
      />
    );
  }
}

export default TripLinks;
