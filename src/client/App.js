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
import { ForgotPassword } from './pages/ForgotPassword';

export const App = () => {
  const renderAllTrips = (pathObj) => {
    const { history, location: { state = {} } } = pathObj;
    const { refresh, messageObj, messageObjFromRefresh } = state;
    const messageObjToRender = messageObjFromRefresh || messageObj;

    if (refresh) {
      history.replace({
        state: { refresh: false, messageObj: null, messageObjFromRefresh: messageObj },
      });
      window.location.reload();
      return false;
    }

    if (messageObjFromRefresh) {
      history.replace({ state: { messageObjFromRefresh: null } });
    }

    return <HomePageRedirector messageObj={messageObjToRender} />;
  };
  const renderNewTrip = () => <NewTripPage />;
  const renderTripLinksWrapper = (pathObj) => {
    const {
      match: { params: { n: tripId } },
      location: { state: { refresh = false, messageObj = null } = {} },
      history,
    } = pathObj;
    if (refresh) {
      history.replace({
        state: { refresh: false, messageObj },
      });
      window.location.reload();
      return false;
    }
    return <TripLinksWrapper tripId={tripId} pathObj={pathObj} messageObj={messageObj} />;
  };
  const renderAccountRedirector = () => <AccountRedirector />;
  const renderTestPage = () => <TestPage />;
  const renderNewUser = () => <NewUserPage />;
  const renderForgotPassword = () => <ForgotPassword />;

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
          <Route exact path="/forgot-password" render={renderForgotPassword} />
          <Route path="/trips/:n" render={renderTripLinksWrapper} />
          <Route component={NotFoundPage} />
        </Switch>
      </Layout>
    </Router>
  );
};

export default App;
