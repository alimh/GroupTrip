import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout } from './Layout';
import { IndexPage } from './IndexPage';
import { NotFoundPage } from './NotFoundPage';

const renderIndex = () => <IndexPage />;
// const renderAthlete = ({ match, staticContext }) => {
//   const id = match.params.id;
//   const athlete = athletes.find(current => current.id === id);
//   if (!athlete) {
//     return <NotFoundPage staticContext={staticContext} />;
//   }

//   return <AthletePage athlete={athlete} athletes={athletes} />;
// };

export const App = () => (
  <Layout>
    <Switch>
      <Route exact path="/" render={renderIndex} />
      <Route component={NotFoundPage} />
    </Switch>
  </Layout>
);

export default App;
