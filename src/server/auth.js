import express from 'express';
import jwt from 'jsonwebtoken';

const router = new express.Router();
router.post('/login', (req, res) => {
  const token = 'abcdef';
  const userName = req.body.username;

  return req.body.username === 'test'
    ? res
      .status(200)
      .json({ token, userName })
      .end()
    : res.status(401).end();
});

export default router;
