import express from 'express';
import jwt from 'jsonwebtoken';

const router = new express.Router();
const secret = 'secret';
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const payload = {
    username,
    id: username,
    expires: Date.now() + 120000
  };

  const token = jwt.sign(JSON.stringify(payload), secret);

  return password === 'test'
    ? res
      .cookie('jwt', token)
      .status(200)
      .end()
    : res.status(401).end();
});

router.post('/logout', (req, res) =>
  res
    .clearCookie('jwt')
    .send()
    .end());

router.get('/check-auth', (req, res) =>
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
      username: res.locals.user ? res.locals.user.username : null
    })
    .end());

export default router;
