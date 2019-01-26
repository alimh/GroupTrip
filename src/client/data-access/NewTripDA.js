import React from 'react';
import Axios from 'axios';
import Auth from '../utils/Auth';
import { NewTripView } from '../components/NewTripView';
import { LoadingView } from '../components/LoadingView';

export class NewTripDA extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: false,
    };
  }

  handleCreate(tripObject) {
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
    Axios.post('/api/trips/new', payload, {
      headers: { Authorization: authorizationHeader },
    })
      .then((res) => {
        console.log(res);
        this.props.message({ success: 'Created' });
        this.setState({ loading: false });
        // TODO: redirct to new link
      })
      .catch((err) => {
        this.setState({ loading: false });
        this.props.message({ err: err.toString() });
      });
  }

  render() {
    if (this.state.loading) return <LoadingView />;
    return (
      <NewTripView onCreate={newTripObj => this.handleCreate(newTripObj)} />
    );
  }
}

export default NewTripDA;
