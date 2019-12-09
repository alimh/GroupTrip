import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { TripIndexPage } from './TripIndexPage';
import { TripSettingsPage } from './TripSettingsPage';
import { NotFoundPage } from './NotFoundPage';
import { ExpensesPage } from './ExpensesPage';
import { SummaryPage } from './SummaryPage';
import { TripLinks } from '../data-access/TripLinksDA';
import { DisappearingAlert } from '../components/DisappearingAlert';

const renderSettings = tripId => <TripSettingsPage tripId={tripId} />;
const renderSummary = tripId => <SummaryPage tripId={tripId} />;
const renderTripPage = tripId => <TripIndexPage tripId={tripId} />;
const renderExpensesPage = tripId => <ExpensesPage tripId={tripId} />;

export class TripLinksWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tripId: props.pathObj.match.params.n || null,
      messageObj: null
    };
  }

  handleMessage(msg) {
    this.setState({
      messageObj: msg
    });
  }

  handleSuccess() {
    this.setState({ loadChild: true });
  }

  render() {
    const child = () => (
      <Switch>
        <Route
          exact
          path={`${this.props.pathObj.match.path}/settings`}
          render={() => renderSettings(this.state.tripId)}
        />
        <Route
          exact
          path={`${this.props.pathObj.match.path}/summary`}
          render={() => renderSummary(this.state.tripId)}
        />
        <Route
          exact
          path={`${this.props.pathObj.match.path}/home`}
          render={() => renderTripPage(this.state.tripId)}
        />
        <Route
          exact
          path={`${this.props.pathObj.match.path}/expenses`}
          render={() => renderExpensesPage(this.state.tripId)}
        />
        <Route
          path={`${this.props.pathObj.match.path}`}
          render={() => renderTripPage(this.state.tripId)}
        />
        <Route component={NotFoundPage} />
      </Switch>
    );
    return (
      <div>
        <Container>
          <DisappearingAlert messageObj={this.state.messageObj} />
        </Container>
        <TripLinks
          tripId={this.state.tripId}
          message={msg => this.handleMessage(msg)}
          onSuccess={() => this.handleSuccess()}
        />
        <br />
        {this.state.loadChild ? child() : <div />}
      </div>
    );
  }
}

export default TripLinksWrapper;
