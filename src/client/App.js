import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Layout } from './pages/Layout';
import { NotFoundPage } from './pages/NotFoundPage';
import { AllTrips } from './pages/AllTrips';
import { NewTripPage } from './pages/NewTripPage';
import { TripLinksWrapper } from './pages/TripLinksWrapper';
import { LoginPage } from './pages/LoginPage';

// const renderAllTrips = () => <AllTrips />;
// const renderNewTrip = () => <NewTripPage />;
// const renderTripLinksWrapper = pathObj => (
//   <TripLinksWrapper tripId={pathObj.match.params.n} pathObj={pathObj} />
// );
// const renderLoginPage = () => <LoginPage />;

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { token: null, userName: null };
  }
  handleLogin(token, userName) {
    console.log(token, userName);
    this.setState({ token, userName });
  }
  renderAllTrips = () => <AllTrips token={this.state.token} />;
  renderNewTrip = () => <NewTripPage token={this.state.token} />;
  renderTripLinksWrapper = pathObj => (
    <TripLinksWrapper
      token={this.state.token}
      tripId={pathObj.match.params.n}
      pathObj={pathObj}
    />
  );
  renderLoginPage = () => (
    <LoginPage
      token={this.state.token}
      onLogin={(token, userName) => this.handleLogin(token, userName)}
    />
  );
  // export const App = () => {
  render() {
    console.log('rendering App');
    return (
      <Router>
        <Layout userName={this.state.userName}>
          <Switch>
            <Route exact path="/" render={this.renderAllTrips} />
            <Route exact path="/login" render={this.renderLoginPage} />
            <Route exact path="/new" render={this.renderNewTrip} />
            <Route path="/trips/:n" render={this.renderTripLinksWrapper} />
            <Route component={NotFoundPage} />
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default App;
