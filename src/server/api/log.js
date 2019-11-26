import express from 'express';
import Log from '../models/log';
import Expense from '../models/expenses';

const router = new express.Router();

router.get('/recent', (req, res) => {
  const token = req.headers.authorization.split(' ')[1] || null;
  const { tripId } = req.query;

  Log.find({ tripId }, (err, entries) => {
    if (err) return res.status(403).end();

    return res
      .status(200)
      .json(entries.reverse())
      .end();
  });
});

export default router;
