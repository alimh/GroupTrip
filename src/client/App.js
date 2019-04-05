import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Layout } from './pages/Layout';
import { TripIndexPage } from './pages/TripIndexPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { TripSettingsPage } from './pages/TripSettingsPage';
// import { ExpensesPage } from './pages/ExpensesPage';
// import { SummaryPage } from './pages/SummaryPage';
import { AllTrips } from './pages/AllTrips';
import { NewTripPage } from './pages/NewTripPage';

// import './style.css';

// const renderIndex = () => <IndexPage test2="test2" />;
// const renderAthlete = ({ match, staticContext }) => {
//   const id = match.params.id;
//   const athlete = athletes.find(current => current.id === id);
//   if (!athlete) {
//     return <NotFoundPage staticContext={staticContext} />;
//   }

//   return <AthletePage athlete={athlete} athletes={athletes} />;
// };

const renderAllTrips = () => <AllTrips />;
// const renderExpenses = () => <ExpensesPage />;
const renderSettings = pathObj => (
  <TripSettingsPage tripId={pathObj.match.params.n} />
);
// const renderSummary = () => <SummaryPage />;
const renderNewTrip = () => <NewTripPage />;
const renderTripPage = pathObj => (
  <TripIndexPage tripId={pathObj.match.params.n} />
);

export const App = () => (
  <Router>
    <Layout>
      <Switch>
        <Route exact path="/" render={renderAllTrips} />
        <Route exact path="/new" render={renderNewTrip} />
        <Route
          exact
          path="/trips/:n/settings"
          render={pathObj => renderSettings(pathObj)}
        />
        <Route
          exact
          path="/trips/:n"
          render={pathObj => renderTripPage(pathObj)}
        />
        <Route component={NotFoundPage} />
      </Switch>
    </Layout>
  </Router>
);

export default App;
