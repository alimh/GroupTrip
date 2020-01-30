import React from 'react';
import Axios from 'axios';
import { TripLinksBanner } from '../components/TripLinksBanner';
import { LoadingView } from '../components/LoadingView';
import { LoggedOutMessage } from '../components/LoggedOutMessage';

import MessageContext from '../components/MessageContext';

export class TripLinks extends React.Component {
  constructor(props) {
    super(props);

    const tripId = props.tripId || null;

    this.state = {
      loading: true,
      tripId,
      tripName: null,
    };
  }

  componentDidMount() {
    const { tripId } = this.state;
    const { onSuccess } = this.props;
    const { sendMessage } = this.context;

    if (tripId) {
      Axios.get('/api/trips/getName', {
        params: { id: tripId },
      })
        .then((response) => {
          const { data } = response;
          this.setState({
            loading: false,
            tripName: data.name,
            isOwner: data.isOwner,
          });
          onSuccess();
        })
        .catch((err) => {
          this.setState({ loading: false });
          sendMessage({
            text:
              err.response.status === 401
                ? LoggedOutMessage()
                : err.response.data,
            variant: 'error',
          });
        });
    }
  }

  render() {
    const {
      tripId, tripName, isOwner, loading,
    } = this.state;

    if (loading) return <LoadingView />;
    return (
      <TripLinksBanner
        tripId={tripId}
        tripName={tripName}
        isOwner={isOwner}
      />
    );
  }
}

TripLinks.contextType = MessageContext;

export default TripLinks;
