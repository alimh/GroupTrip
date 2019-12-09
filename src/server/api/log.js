import express from 'express';
import Log from '../models/log';
import Expense from '../models/expenses';

const router = new express.Router();

router.get('/recent', (req, res) => {
  const token = res.locals.user ? res.locals.user.id : null;
  const { tripId } = req.query;

  Log.find(
    { tripId },
    null,
    { limit: 10, sort: { timestamp: 'desc' } },
    (err, entries) => {
      if (err) return res.status(403).end();

      return res
        .status(200)
        .json(entries)
        .end();
    }
  );
});

export default router;
