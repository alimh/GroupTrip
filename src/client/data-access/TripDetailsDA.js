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
      authorizationHeader: Auth.getToken()
        ? 'bearer '.concat(Auth.getToken())
        : null,
      tripObj: null,
      tripId,
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
    this.setState({ loading: true });
    Axios.post('/api/trips/save', payload, {
      headers: { Authorization: this.state.authorizationHeader },
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
    this.setState({ loading: true });
    Axios.post('/api/trips/remove', payload, {
      headers: { Authorization: this.state.authorizationHeader },
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

  handleCancel() {
    // Go back to where we came from
    // if there is a tripObj, go back to the trip page
    // if there is no tripObj, go back to the root page
    this.props.redirect(this.state.tripId ? '/trips/'.concat(this.state.tripId) : '/');
  }

  render() {
    if (this.state.loading) return <LoadingView />;
    return (
      <TripDetailsView
        tripObj={this.state.tripObj}
        onSave={tripObj => this.handleSave(tripObj)}
        onRemove={() => this.handleRemove()}
        onCancel={() => this.handleCancel()}
      />
    );
  }
}

export default TripDetailsDA;
