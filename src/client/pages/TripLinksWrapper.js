import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { TripIndexPage } from './TripIndexPage';
import { TripSettingsPage } from './TripSettingsPage';
import { NotFoundPage } from './NotFoundPage';
import { ExpensesPage } from './ExpensesPage';
import { SummaryPage } from './SummaryPage';
import { TripLinks } from '../data-access/TripLinksDA';

const renderSettings = tripId => <TripSettingsPage tripId={tripId} />;
const renderSummary = tripId => <SummaryPage tripId={tripId} />;
const renderTripPage = tripId => <TripIndexPage tripId={tripId} />;
const renderExpensesPage = tripId => <ExpensesPage tripId={tripId} />;

export class TripLinksWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tripId: props.pathObj.match.params.n || null
    };
  }

  handleSuccess() {
    this.setState({ loadChild: true });
  }

  render() {
    const { tripId } = this.state;
    const child = () => (
      <Switch>
        <Route
          exact
          path={`${this.props.pathObj.match.path}/settings`}
          render={() => renderSettings(tripId)}
        />
        <Route
          exact
          path={`${this.props.pathObj.match.path}/summary`}
          render={() => renderSummary(tripId)}
        />
        <Route
          exact
          path={`${this.props.pathObj.match.path}/home`}
          render={() => renderTripPage(tripId)}
        />
        <Route
          exact
          path={`${this.props.pathObj.match.path}/expenses`}
          render={() => renderExpensesPage(tripId)}
        />
        <Route
          path={`${this.props.pathObj.match.path}`}
          render={() => renderTripPage(tripId)}
        />
        <Route component={NotFoundPage} />
      </Switch>
    );
    return (
      <div>
        <TripLinks
          tripId={this.state.tripId}
          onSuccess={() => this.handleSuccess()}
        />
        <br />
        {this.state.loadChild ? child() : <div />}
      </div>
    );
  }
}

export default TripLinksWrapper;
