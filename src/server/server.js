/* eslint no-console: "off" */

import path from 'path';
import { Server } from 'http';
import Express from 'express';
// import React from 'react';
import Mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
// import { renderToString } from 'react-dom/server';
// import { StaticRouter as Router } from 'react-router-dom';
// import { App } from '../client/App';
import ApiSettings from './api/settings';
import ApiExpenses from './api/expenses';
import ApiTrips from './api/trips';
// import template from '../../public/template';

dotenv.config();

const app = new Express();
const server = new Server(app);

Mongoose.Promise = Promise;
Mongoose.connect(process.env.MONGO_DB);

// // use ejs templates
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// define the folder that will be used for static assets
app.use(Express.static('dist'));

app.use(bodyParser.json());

// app.use('/api', checkAuth);
app.use('/api/settings', ApiSettings);
app.use('/api/expenses', ApiExpenses);
app.use('/api/trips', ApiTrips);

// universal routing and rendering
app.get(
  '/*',
  (req, res) => res.sendFile(path.join(__dirname, '../../dist/index.html'))
  // const markup = '';
  // const status = 200;
  //   console.log('getting: ');
  //   console.log(req.url);

  //   if (!process.env.UNIVERSAL) {
  //     const context = {};
  //     console.log('rendering universal');
  //     // eslint-disable-next-line function-paren-newline
  //     markup = renderToString(
  //       <Router location={req.url} context={context}>
  //         <App />
  //       </Router>);

  //     // context.url will contain the URL to redirect to if a <Redirect> was used
  //     if (context.url) {
  //       return res.redirect(302, context.url);
  //     }

  //     if (context.is404) {
  //       status = 404;
  //     }
  //   }

  // return res.status(status).send(template({
  //     body: markup,
  //     title: req.url,
  //   }));
);

// start the server
const port = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'production';
server.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.info(`
      Server running on http://localhost:${port} [${env}]
      Universal rendering: ${process.env.UNIVERSAL ? 'enabled' : 'disabled'}
    `);
});
