import React from 'react';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
import { TripDetailsView } from '../components/TripDetailsView';
import { LoadingView } from '../components/LoadingView';
import { LoggedOutMessage } from '../components/LoggedOutMessage';

export class TripDetailsDA extends React.Component {
  constructor(props) {
    super(props);

    const tripId = props.tripId || null;

    this.state = {
      loading: tripId !== null,
      tripObj: null,
      tripId
    };
  }

  componentDidMount() {
    if (this.state.tripId) {
      Axios.get('/api/trips/get', {
        params: { id: this.state.tripId }
      })
        .then((response) => {
          const { data } = response;
          this.setState({ loading: false, tripObj: data });
        })
        .catch((err) => {
          this.setState({ loading: false });
          if (this.props.message) {
            this.props.message({
              text:
                err.response.status === 401
                  ? LoggedOutMessage()
                  : err.response.data,
              variant: 'error'
            });
          } else throw err;
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
    this.setState({ loading: true, tripObj: tripObject });
    Axios.post('/api/trips/save', payload)
      .then((res) => {
        this.props.redirect('/trips/'.concat(res.data));
        // if (this.props.message) {
        //   this.props.message({
        //     text: this.state.tripId ? 'Saved' : 'Created New Trip',
        //     variant: 'success'
        //   });
        // }
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        if (this.props.message) this.props.message({ error: err.toString() });
        else throw err;
      });
  }

  handleRemove() {
    const payload = { id: this.state.tripId };
    this.setState({ loading: true });
    Axios.post('/api/trips/remove', payload)
      .then(() => {
        this.props.redirect('/');
      })
      .catch((err) => {
        this.setState({ loading: false });
        if (this.props.message) {
          this.props.message({ text: err.toString(), variant: 'error' });
        } else throw err;
      });
  }

  handleCancel() {
    // TODO: Go back to where we came from
    // if there is a tripObj, go back to the trip page
    // if there is no tripObj, go back to the root page
    //    this.props.redirect(this.state.tripId ? '/trips/'.concat(this.state.tripId) : '/');
    //    if (this.props.onCancel) this.props.onCancel();

    // this.props.cancel();
    this.props.history.goBack();
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

export default withRouter(TripDetailsDA);
