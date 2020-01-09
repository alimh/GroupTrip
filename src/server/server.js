/* eslint no-console: "off" */

import path from 'path';
import { Server } from 'http';
import Express from 'express';
import Mongoose from 'mongoose';
// import Passport from 'passport';
// import Strategy from 'passport-local';
// import Session from 'express-session';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import ApiExpenses from './api/expenses';
import ApiTrips from './api/trips';
import ApiLog from './api/log';
import ApiUsers from './api/users';
import auth from './auth';

require('./passportSetup');
const passport = require('passport');

dotenv.config();

const app = new Express();
const server = new Server(app);

Mongoose.Promise = Promise;
Mongoose.connect(process.env.MONGO_DB);

// define the folder that will be used for static assets
app.use(Express.static('dist'));

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.log(err);
      return res.status(500).end();
    }
    const message = info ? info.message : null;
    console.log('using jwt strategy');
    console.log(message);
    console.log(user);
    console.log(info);
    if (message === 'expired') {
      return res
        .clearCookie('jwt')
        .status(401)
        .send('Your session has expired.')
        .end();
    }
    res.locals.user = user || null;
    return next();
  })(req, res, next);
  return true;
});

// app.use('/api', checkAuth);
app.use('/api/expenses', ApiExpenses);
app.use('/api/users', ApiUsers);
app.use('/api/trips', ApiTrips);
app.use('/api/log', ApiLog);
app.use('/auth', auth);

// routing and rendering
app.get('/*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// start the server
const port = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'production';
server.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.info(`
      Server running on http://localhost:${port} [${env}]
    `);
});
