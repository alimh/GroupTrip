import express from 'express';
import Users from '../models/users';

const router = new express.Router();

router.get('/settings', (req, res) => {
  const { id } = res.locals.user || {};
  Users.findById(id)
    .then((userDocument) => {
      const { name, email } = userDocument;
      return res
        .status(200)
        .send({ name, email })
        .end();
    })
    .catch(err =>
      res
        .status(403)
        .send(err)
        .end());
  return true;
});

router.post('/commonsettings', (req, res) => {
  const { id } = res.locals.user || {};

  const userDetails = {
    name: req.body.name,
    email: req.body.email
  };

  Users.findById(id)
    .then(userDocument => userDocument.updateOne(userDetails))
    .then(() => res.status(200).end())
    .catch(err =>
      res
        .status(403)
        .send(err)
        .end());
  return true;
});

router.post(
  '/password',
  (req, res) =>
    res
      .status(403)
      .send('Sorry, still need to implement this.')
      .end()
  //  const { id } = res.locals.user || {};

  // const { current_password, password } = req.body;

  // Users.findById(id)
  //   .then(userDocument => userDocument.update(userDetails))
  //   .then(() => res.status(200).end())
  //   .catch(err =>
  //     res
  //       .status(403)
  //       .send(err)
  //       .end());
  // return true;
);

export default router;
