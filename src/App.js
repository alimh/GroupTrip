import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout } from './pages/Layout';
import { IndexPage } from './pages/IndexPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SettingsPage } from './pages/SettingsPage';

const renderIndex = () => <IndexPage />;
// const renderAthlete = ({ match, staticContext }) => {
//   const id = match.params.id;
//   const athlete = athletes.find(current => current.id === id);
//   if (!athlete) {
//     return <NotFoundPage staticContext={staticContext} />;
//   }

//   return <AthletePage athlete={athlete} athletes={athletes} />;
// };

const renderSettings = () => <SettingsPage />;

export const App = () => (
  <Layout>
    <Switch>
      <Route exact path="/" render={renderIndex} />
      <Route exact path="/settings" render={renderSettings} />
      <Route component={NotFoundPage} />
    </Switch>
  </Layout>
);

export default App;
