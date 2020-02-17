import express from 'express';
import jwt from 'jsonwebtoken';
import Passport from 'passport';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import UserObjs from './models/users';

dotenv.config();
const router = new express.Router();
const secret = process.env.SECRET;
const hashCost = 10;

require('./passportSetup');

router.post('/signup', async (req, res) => {
  const {
    name, password, email, reminderQuestion, reminderAnswer,
  } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, hashCost);
    const reminderHash = await bcrypt.hash(reminderAnswer.toLowerCase(), hashCost);
    const userDocument = new UserObjs({
      name, email: email.toLowerCase(), passwordHash, reminderQuestion, reminderHash,
    });
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
          expires,
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
      },
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
        expires,
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
    },
  )(req, res);
  return true;
});

router.post('/logout', (req, res) => res
  .clearCookie('jwt')
  .send()
  .end());

router.get('/question', (req, res) => {
  const { email } = req.query;
  UserObjs.findOne({ email })
    .then((userDocument) => res
      .status(200)
      .send({ question: userDocument.reminderQuestion })
      .end())
    .catch((err) => res
      .status(403)
      .send(err)
      .end());
  return true;
});

router.post(
  '/answer',
  (req, res) => {
    const { email, reminderAnswer, password } = req.body;

    // check answer
    // if incorrect, send error
    // encrypt new password and save to db
    // send success

    UserObjs.findOne({ email })
      .then(async (userDocument) => {
        const passwordsMatch = await bcrypt.compare(
          reminderAnswer.toLowerCase(),
          userDocument.reminderHash,
        );
        if (!passwordsMatch) return res.status(403).send('Incorrect answer').end();
        const passwordHash = await bcrypt.hash(password, hashCost);

        return userDocument.updateOne({ passwordHash });
      })
      .then(() => res.status(200).end())
      .catch((err) => res
        .status(403)
        .send(err)
        .end());
    return false;
  },
);

export default router;
