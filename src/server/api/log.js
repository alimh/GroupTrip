import express from 'express';
import Log from '../models/log';

const router = new express.Router();

router.get('/recent', (req, res) => {
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
    },
  );
});

router.get('/all', (req, res) => {
  const { tripId } = req.query;

  Log.find(
    { tripId },
    null,
    { sort: { timestamp: 'desc' } },
    (err, entries) => {
      if (err) return res.status(403).end();

      return res
        .status(200)
        .json(entries)
        .end();
    },
  );
});

export default router;
