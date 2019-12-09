const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');

const JWTStrategy = passportJWT.Strategy;
// const bcrypt = require('bcrypt');

// const { secret } = require('./keys');

// const UserModel = require('./models/user');

const secret = 'secret';

passport.use(new LocalStrategy((username, password, done) => {
    // const userDocument = await UserModel.findOne({
    //   username
    // }).exec();
    // const passwordsMatch = await bcrypt.compare(
    //   password,
    //   userDocument.passwordHash
    // );
    console.log(username);
    console.log(password);
    const passwordsMatch = username === 'test';

    if (passwordsMatch) {
      //          return done(null, userDocument);
      return done(null, { username: 'Alim' });
    }
    return done('Incorrect Username / Password');
  }));

passport.use(new JWTStrategy(
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
