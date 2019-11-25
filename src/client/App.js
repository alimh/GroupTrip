import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Layout } from './pages/Layout';
import { NotFoundPage } from './pages/NotFoundPage';
import { AllTrips } from './pages/AllTrips';
import { NewTripPage } from './pages/NewTripPage';
import { TripLinksWrapper } from './pages/TripLinksWrapper';
import { AccountRedirector } from './components/AccountRedirector';
import { TestPage } from './pages/TestPage';

const renderAllTrips = () => <AllTrips />;
const renderNewTrip = () => <NewTripPage />;
const renderTripLinksWrapper = pathObj => (
  <TripLinksWrapper tripId={pathObj.match.params.n} pathObj={pathObj} />
);
const renderAccountRedirector = () => <AccountRedirector />;
const renderTestPage = () => <TestPage />;

export const App = () => (
  <Router>
    <Layout>
      <Switch>
        <Route exact path="/" render={renderAllTrips} />
        <Route exact path="/login" render={renderAccountRedirector} />
        <Route exact path="/new" render={renderNewTrip} />
        <Route exact path="/account" render={renderAccountRedirector} />
        <Route exact path="/test" render={renderTestPage} />
        <Route path="/trips/:n" render={renderTripLinksWrapper} />
        <Route component={NotFoundPage} />
      </Switch>
    </Layout>
  </Router>
);

export default App;
