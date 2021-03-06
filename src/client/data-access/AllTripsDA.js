import React from 'react';
import Axios from 'axios';
import { LoadingView } from '../components/LoadingView';
import { TripsList } from '../components/TripsList';
import MessageContext, { ErrToMessageObj } from '../components/MessageContext';

export class AllTripsDA extends React.Component {
  static contextType = MessageContext;

  constructor(props) {
    super(props);

    this.state = {
      tripsOwn: [],
      tripsContribute: []
    };
  }

  componentDidMount() {
    this.getTripsFromServer();
  }

  getTripsFromServer() {
    /* Gets an array of trips from the server
    [
      {
        tripId: String,
        tripName: String,
        travelers: [String],
        categories: [String],
      }
    ]
    */
    Axios.get('/api/trips/all')
      .then((response) => {
        const { data } = response;

        this.setState({
          loading: false,
          tripsOwn: data.own,
          tripsContribute: data.contribute
        });
      })
      .catch((err) => {
        this.setState({ loading: false });
        this.context.sendMessage(ErrToMessageObj(err));
      });
  }

  render() {
    if (this.state.loading) return <LoadingView />;
    const tripsOwn =
      this.state.tripsOwn.length > 0 ? (
        <div>
          <h3>
            <small className="text-muted">Your Trips</small>
          </h3>
          <TripsList trips={this.state.tripsOwn} />
        </div>
      ) : (
        <div />
      );

    const tripsContribute =
      this.state.tripsContribute.length > 0 ? (
        <div>
          <h3>
            <small className="text-muted">Trips You Have Contributed To</small>
          </h3>
          <TripsList trips={this.state.tripsContribute} />
        </div>
      ) : (
        <div />
      );

    return (
      <div>
        {tripsOwn}
        <br />
        {tripsContribute}
      </div>
    );
  }
}

export default AllTripsDA;
