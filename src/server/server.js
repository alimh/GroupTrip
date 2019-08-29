/* eslint no-console: "off" */

import path from 'path';
import { Server } from 'http';
import Express from 'express';
import Mongoose from 'mongoose';
import Passport from 'passport';
import Strategy from 'passport-local';
import Session from 'express-session';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import ApiExpenses from './api/expenses';
import ApiTrips from './api/trips';
import auth from './auth';

dotenv.config();

const app = new Express();
const server = new Server(app);

Mongoose.Promise = Promise;
Mongoose.connect(process.env.MONGO_DB);

// passport setup
Passport.use(new Strategy((user, pass, done) => done(null, user)));
Passport.serializeUser((user, cb) => {
  cb(null, 1);
});
Passport.deserializeUser((id, cb) => {
  cb(null, 1);
});

// define the folder that will be used for static assets
app.use(Express.static('dist'));

app.use(bodyParser.json());
app.use(Session({ secret: 'keyboard', resave: false, saveUninitialized: false }));
app.use(Passport.initialize());
app.use(Passport.session());

// app.use('/api', checkAuth);
app.use('/api/expenses', ApiExpenses);
app.use('/api/trips', ApiTrips);
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
