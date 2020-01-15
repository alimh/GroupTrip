import Passport from 'passport';
import PassportLocal from 'passport-local';
import PassportJwt from 'passport-jwt';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import UserObjs from './models/users';

dotenv.config();
// const LocalStrategy = require('passport-local').Strategy;
// const passportJWT = require('passport-jwt');
const LocalStrategy = PassportLocal.Strategy;
const JWTStrategy = PassportJwt.Strategy;

// const { secret } = require('./keys');

const secret = process.env.SECRET;

Passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const userDocument = await UserObjs.findOne({ email }).exec();
        const passwordsMatch = await bcrypt.compare(
          password,
          userDocument.passwordHash
        );

        if (passwordsMatch) {
          const payload = { name: userDocument.name, id: userDocument.id };
          return done(null, payload);
        }
        return done('Incorrect Username / Password');
      } catch (error) {
        done(error);
      }
    }
  ));

Passport.use(new JWTStrategy(
    {
      jwtFromRequest: req => req.cookies.jwt || null,
      secretOrKey: secret
    },
    (jwtPayload, done) => {
      if (Date.now() > jwtPayload.expires) {
        return done(null, false, { message: 'expired' });
      }

      return done(null, jwtPayload);
    }
  ));
