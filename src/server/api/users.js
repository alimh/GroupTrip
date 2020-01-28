import express from 'express';
import bcrypt from 'bcrypt';
import Users from '../models/users';

const router = new express.Router();

const hashCost = 10;

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
      name: res.locals.user ? res.locals.user.name : null,
    })
    .end();
});

router.get('/settings', (req, res) => {
  const { id } = res.locals.user || {};
  Users.findById(id)
    .then((userDocument) => {
      const { name, email, reminderQuestion } = userDocument;
      return res
        .status(200)
        .send({ name, email, reminderQuestion })
        .end();
    })
    .catch((err) => res
      .status(403)
      .send(err)
      .end());
  return true;
});

router.post('/commonsettings', (req, res) => {
  const { id } = res.locals.user || {};

  const userDetails = {
    name: req.body.name,
    email: req.body.email,
  };

  Users.findById(id)
    .then((userDocument) => userDocument.updateOne(userDetails))
    .then(() => res.status(200).end())
    .catch((err) => res
      .status(403)
      .send(err)
      .end());
  return true;
});

router.post(
  '/password',
  (req, res) => {
    const { id } = res.locals.user || {};

    const { currentPassword, password } = req.body;

    // load id and check password
    // if incorrect current password, send error
    // encrypt new password and save to db
    // send success

    Users.findById(id)
      .then(async (userDocument) => {
        const passwordsMatch = await bcrypt.compare(
          currentPassword,
          userDocument.passwordHash,
        );
        if (!passwordsMatch) return res.status(403).send('Incorrect password').end();
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

router.post(
  '/reminder',
  (req, res) => {
    const { id } = res.locals.user || {};

    const { currentPasswordReminder, reminderQuestion, reminderAnswer } = req.body;

    // find user
    // check current password
    // if incorrect, send error
    // encrypt new answer
    // send success
    Users.findById(id)
      .then(async (userDocument) => {
        const passwordsMatch = await bcrypt.compare(
          currentPasswordReminder,
          userDocument.passwordHash,
        );
        if (!passwordsMatch) return res.status(403).send('Incorrect password').end();
        const reminderHash = await bcrypt.hash(reminderAnswer, hashCost);

        return userDocument.updateOne({ reminderQuestion, reminderHash });
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
