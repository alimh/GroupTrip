import express from 'express';

const router = new express.Router();
router.post('/login', (req, res) => {
  console.log('here');
  console.log(req.body);

  const token = 'abcdef';
  const userName = req.body.username;

  return res
    .status(200)
    .json({ token, userName })
    .end();
});

export default router;
