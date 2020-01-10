import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Layout } from './pages/Layout';
import { NotFoundPage } from './pages/NotFoundPage';
import { NewTripPage } from './pages/NewTripPage';
import { TripLinksWrapper } from './pages/TripLinksWrapper';
import { AccountRedirector } from './components/AccountRedirector';
import { TestPage } from './pages/TestPage';
import { NewUserPage } from './pages/NewUserPage';
import { HomePageRedirector } from './pages/HomePageRedirector';

export const App = () => {
  const renderAllTrips = (props) => {
    const { refresh, ...otherProps } = props.location.state || {};

    // if (refresh === true) {
    //   const { history } = props;
    //   history.replace({
    //     pathname: '/',
    //     state: { refresh: false, ...otherProps }
    //   });
    //   window.location.reload();
    //   return false;
    // }

    return <HomePageRedirector {...otherProps} />;
  };
  const renderNewTrip = () => <NewTripPage />;
  const renderTripLinksWrapper = pathObj => (
    <TripLinksWrapper tripId={pathObj.match.params.n} pathObj={pathObj} />
  );
  const renderAccountRedirector = () => <AccountRedirector />;
  const renderTestPage = () => <TestPage />;
  const renderNewUser = () => <NewUserPage />;

  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" render={renderAllTrips} />
          <Route exact path="/login" render={renderAccountRedirector} />
          <Route exact path="/new" render={renderNewTrip} />
          <Route exact path="/account" render={renderAccountRedirector} />
          <Route exact path="/newuser" render={renderNewUser} />
          <Route exact path="/test" render={renderTestPage} />
          <Route path="/trips/:n" render={renderTripLinksWrapper} />
          <Route component={NotFoundPage} />
        </Switch>
      </Layout>
    </Router>
  );
};

export default App;
