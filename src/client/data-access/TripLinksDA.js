import React from 'react';
import Axios from 'axios';
import Auth from '../utils/Auth';
import { TripLinksBanner } from '../components/TripLinksBanner';
import { LoadingView } from '../components/LoadingView';

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
    if (this.state.tripId) {
      const authorizationHeader = 'bearer '.concat(Auth.getToken());
      Axios.get('/api/trips/getName', {
        headers: {
          Authorization: authorizationHeader,
        },
        params: { id: this.state.tripId },
      })
        .then((response) => {
          const { data } = response;
          this.setState({
            loading: false,
            tripName: data.name,
            isOwner: data.isOwner,
          });
          this.props.message({ success: true });
        })
        .catch((err) => {
          this.setState({ loading: false });
          this.props.message({ error: err.toString() });
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
