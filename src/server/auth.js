import express from 'express';
import jwt from 'jsonwebtoken';
import Passport from 'passport';
import bcrypt from 'bcrypt';
import UserObjs from './models/users';

const router = new express.Router();
const secret = 'secret';

require('./passportSetup');

router.post('/signup', async (req, res) => {
  const { name, password, email } = req.body;
  const hashCost = 10;

  try {
    const passwordHash = await bcrypt.hash(password, hashCost);
    const userDocument = new UserObjs({ name, email, passwordHash });
    await userDocument.save();

    Passport.authenticate(
      'local',
      { session: false },
      (errorAuthenticate, user, info) => {
        if (errorAuthenticate || !user) {
          return res.status(400).json(errorAuthenticate || info.message);
        }

        const expires = Date.now() + 15552000000; // 180 days

        const payload = {
          id: user.id,
          name: user.name,
          expires
        };

        req.login(payload, { session: false }, (errorLogin) => {
          if (errorLogin) return res.status(400).send(errorLogin);
          const token = jwt.sign(JSON.stringify(payload), secret);
          return res
            .cookie('jwt', token)
            .status(200)
            .end();
        });
        return true;
      }
    )(req, res);
  } catch (error) {
    res.status(400).send(error.toString());
  }
});

router.post('/login', (req, res) => {
  Passport.authenticate(
    'local',
    { session: false },
    (errorAuthenticate, user, info) => {
      if (errorAuthenticate || !user) {
        return res.status(403).json(errorAuthenticate || info.message);
      }

      const expires = Date.now() + 15552000000; // 180 days

      const payload = {
        id: user.id,
        name: user.name,
        expires
      };

      req.login(payload, { session: false }, (errorLogin) => {
        if (errorLogin) return res.status(400).send(errorLogin);
        const token = jwt.sign(JSON.stringify(payload), secret);
        return res
          .cookie('jwt', token)
          .status(200)
          .end();
      });
      return true;
    }
  )(req, res);
  return true;
});

router.post('/logout', (req, res) =>
  res
    .clearCookie('jwt')
    .send()
    .end());

router.get('/check-auth', (req, res) => {
  // TODO re up the cookie
  // {
  //   const payload = res.locals.user ? {
  //     username: res.locals.user.username,
  //     id: res.locals.user.id,
  //     expires:
  //   }
  //   if (res.locals.user)
  // }
  res
    .status(200)
    .send({
      name: res.locals.user ? res.locals.user.name : null
    })
    .end();
});

export default router;
