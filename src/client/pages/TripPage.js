import React from "react";
import { TripPageDA } from "../data-access/TripPageDA";
import { SuccessView } from "../components/SuccessView";
import { ErrorView } from "../components/ErrorView";

export class TripPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: {
        error: null,
        success: null,
      },
    };
  }

  handleMessage(message) {
    this.setState({ messages: message });
  }

  render() {
    return (
      <div className="home">
        <ErrorView error={this.state.messages.error} />
        <SuccessView msg={this.state.messages.success} />

        <TripPageDA
          tripId={this.props.tripId}
          message={m => this.handleMessage(m)}
        />
      </div>
    );
  }
}

export default TripPage;
