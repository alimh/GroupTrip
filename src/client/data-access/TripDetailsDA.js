import React from 'react';
import Axios from 'axios';
import Auth from '../utils/Auth';
import { TripDetailsView } from '../components/TripDetailsView';
import { LoadingView } from '../components/LoadingView';

export class TripDetailsDA extends React.Component {
  constructor(props) {
    super(props);

    const tripId = props.tripId || null;

    this.state = {
      loading: tripId !== null,
      tripObj: null,
      tripId,
    };
  }

  componentDidMount() {
    if (this.state.tripId) {
      const authorizationHeader = 'bearer '.concat(Auth.getToken());
      Axios.get('/api/trips/get', {
        headers: {
          Authorization: authorizationHeader,
        },
        params: { id: this.state.tripId },
      })
        .then((response) => {
          const { data } = response;
          this.setState({ loading: false, tripObj: data });
        })
        .catch((err) => {
          this.setState({ loading: false });
          this.props.message({ err: err.toString() });
        });
    }
  }

  handleSave(tripObject) {
    /* Send an object that contains:
    {
      name: String,
      categories: [String],
      travelers: [String]
    }
    */
    const payload = tripObject;
    const authorizationHeader = 'bearer '.concat(Auth.getToken());

    this.setState({ loading: true });
    Axios.post('/api/trips/save', payload, {
      headers: { Authorization: authorizationHeader },
    })
      .then((res) => {
        this.props.redirect('/trips/'.concat(res.data));
        // this.props.message({ success: 'Saved' });
        //        this.setState({ loading: false, tripObj: tripObject });
        // TODO: redirct to new link
      })
      .catch((err) => {
        this.setState({ loading: false });
        this.props.message({ error: err.toString() });
      });
  }

  handleRemove() {
    const payload = { id: this.state.tripId };
    const authorizationHeader = 'bearer '.concat(Auth.getToken());

    this.setState({ loading: true });
    Axios.post('/api/trips/remove', payload, {
      headers: { Authorization: authorizationHeader },
    })
      .then(() => {
        // this.props.message({ success: 'Removed' });
        // this.setState({ loading: false, tripObj: null });
        // // TODO: redirct to new link
        this.props.redirect('/');
      })
      .catch((err) => {
        this.setState({ loading: false });
        this.props.message({ error: err.toString() });
      });
  }

  render() {
    if (this.state.loading) return <LoadingView />;
    return (
      <TripDetailsView
        tripObj={this.state.tripObj}
        onSave={tripObj => this.handleSave(tripObj)}
        onRemove={() => this.handleRemove()}
      />
    );
  }
}

export default TripDetailsDA;
