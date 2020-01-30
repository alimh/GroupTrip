import React from 'react';
import Axios from 'axios';
import { TripDetailsView } from '../components/TripDetailsView';
import { LoadingView } from '../components/LoadingView';
import { LoggedOutMessage } from '../components/LoggedOutMessage';

import MessageContext, { ErrToMessageObj } from '../components/MessageContext';


export class TripDetailsDA extends React.Component {
  constructor(props) {
    super(props);

    const { tripId = null } = props;

    this.state = {
      loading: tripId !== null,
      tripObj: null,
      tripId,
    };
  }

  componentDidMount() {
    const { tripId } = this.state;
    const { sendMessage } = this.context;

    if (tripId) {
      Axios.get('/api/trips/get', {
        params: { id: tripId },
      })
        .then((response) => {
          const { data } = response;
          this.setState({ loading: false, tripObj: data });
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

  handleSave(tripObject) {
    /* Send an object that contains:
    {
      name: String,
      categories: [String],
      travelers: [String]
    }
    */
    const { redirect } = this.props;
    const { sendMessage } = this.context;
    const { tripObj: oldTripObj } = this.state;

    const payload = tripObject;

    this.setState({ loading: true, tripObj: tripObject });

    Axios.post('/api/trips/save', payload)
      .then((res) => {
        // if it's a new trip, then redirect to main page
        // if updating and name was changed, then reload
        // otherwise, just send a message saying it was saved
        if (!oldTripObj) redirect('/trips/'.concat(res.data));
        else if (oldTripObj.name !== tripObject.name) {
          redirect('/trips/'.concat(res.data).concat('/settings'));
        } else sendMessage({ text: 'Saved', variant: 'success' });
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        sendMessage(ErrToMessageObj(err));
      });
  }

  handleRemove() {
    const { tripId: id } = this.state;
    const { redirect } = this.props;
    const { sendMessage } = this.context;

    const payload = { id };
    this.setState({ loading: true });
    Axios.post('/api/trips/remove', payload)
      .then(() => {
        redirect('/');
      })
      .catch((err) => {
        this.setState({ loading: false });
        sendMessage(ErrToMessageObj(err));
      });
  }

  render() {
    const { loading, tripObj } = this.state;

    if (loading) return <LoadingView />;
    return (
      <TripDetailsView
        tripObj={tripObj}
        onSave={(trip) => this.handleSave(trip)}
        onRemove={() => this.handleRemove()}
      />
    );
  }
}

TripDetailsDA.contextType = MessageContext;

export default TripDetailsDA;
