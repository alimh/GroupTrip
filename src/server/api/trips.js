import express from 'express';
import TripObjs from '../models/trips';

const router = new express.Router();

router.get('/all', (req, res) => {
  TripObjs.find({ removed_at: null }, (err, trips) => {
    if (err) {
      return res.status(403).end();
    }
    return res
      .status(200)
      .json(trips)
      .end();
  });
});

router.get('/get', (req, res) => {
  const { id } = req.query;
  TripObjs.findById(id, (err, trip) => {
    if (!trip || err || trip.removed_at) {
      return res.status(400).end();
    }
    return res
      .status(200)
      .json(trip.toObject({ getters: true }))
      .end();
  });
});

router.post('/save', (req, res) => {
  const categories = req.body.categories.map(c => ({
    label: c.label || '',
    id: c.id !== undefined ? c.id : null,
    active: c.active || false,
  }));
  const travelers = req.body.travelers.map(t => ({
    label: t.label || '',
    id: t.id !== undefined ? t.id : null,
    active: t.active || false,
  }));

  const tripDetails = {
    name: req.body.name || '',
    categories,
    travelers,
    updated_at: new Date(),
    removed_at: null,
  };

  const newTrip = TripObjs({ ...tripDetails });

  if (req.body.id) {
    TripObjs.findByIdAndUpdate(req.body.id, { ...tripDetails }, (err) => {
      if (err) throw err;
    });
  } else {
    newTrip.save((err) => {
      if (err) throw err;
    });
  }

  return res
    .status(200)
    .json(req.body.id || newTrip.id)
    .end();
});

router.post('/remove', (req, res) => {
  TripObjs.findByIdAndUpdate(req.body.id, { removed_at: new Date() }, (err) => {
    if (err) throw err;
  });

  return res.status(200).end();
});

export default router;
