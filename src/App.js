import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout } from './pages/Layout';
import { IndexPage } from './pages/IndexPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SettingsPage } from './pages/SettingsPage';
import { ExpensesPage } from './pages/ExpensesPage';

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
const renderExpenses = () => <ExpensesPage />;

export const App = () => (
  <Layout>
    <Switch>
      <Route exact path="/" render={renderIndex} />
      <Route exact path="/settings" render={renderSettings} />
      <Route exact path="/expenses" render={renderExpenses} />
      <Route component={NotFoundPage} />
    </Switch>
  </Layout>
);

export default App;
