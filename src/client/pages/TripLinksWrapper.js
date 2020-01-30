import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { TripIndexPage } from './TripIndexPage';
import { TripSettingsPage } from './TripSettingsPage';
import { NotFoundPage } from './NotFoundPage';
import { ExpensesPage } from './ExpensesPage';
import { SummaryPage } from './SummaryPage';
import { TripLinks } from '../data-access/TripLinksDA';

import MessageContext from '../components/MessageContext';

const renderSettings = (tripId) => <TripSettingsPage tripId={tripId} />;
const renderSummary = (tripId) => <SummaryPage tripId={tripId} />;
const renderTripPage = (tripId) => <TripIndexPage tripId={tripId} />;
const renderExpensesPage = (tripId) => <ExpensesPage tripId={tripId} />;

export class TripLinksWrapper extends React.Component {
  constructor(props) {
    super(props);

    const { tripId = null, messageObj = null } = props;

    this.state = {
      tripId,
      messageObj,
      loadChild: false,
    };
  }

  componentDidMount() {
    const { messageObj } = this.state;
    const { sendMessage } = this.context;

    if (messageObj) sendMessage(messageObj);
  }

  handleSuccess() {
    this.setState({ loadChild: true });
  }

  render() {
    const { tripId, loadChild } = this.state;
    const { pathObj: { match: { path } } } = this.props;

    const child = () => (
      <Switch>
        <Route
          exact
          path={`${path}/settings`}
          render={() => renderSettings(tripId)}
        />
        <Route
          exact
          path={`${path}/summary`}
          render={() => renderSummary(tripId)}
        />
        <Route
          exact
          path={`${path}/home`}
          render={() => renderTripPage(tripId)}
        />
        <Route
          exact
          path={`${path}/expenses`}
          render={() => renderExpensesPage(tripId)}
        />
        <Route
          path={`${path}`}
          render={() => renderTripPage(tripId)}
        />
        <Route component={NotFoundPage} />
      </Switch>
    );
    return (
      <div>
        <TripLinks
          tripId={tripId}
          onSuccess={() => this.handleSuccess()}
        />
        <br />
        {loadChild ? child() : <div />}
      </div>
    );
  }
}

TripLinksWrapper.contextType = MessageContext;

export default TripLinksWrapper;
