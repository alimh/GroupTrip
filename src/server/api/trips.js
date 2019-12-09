import express from 'express';
import TripObjs from '../models/trips';

const router = new express.Router();

router.get('/all', (req, res) => {
  const token = res.locals.user ? res.locals.user.id : null;
  TripObjs.find({ removed_at: null, owner: token }, (err, trips) => {
    if (err || token === null) {
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
  const token = res.locals.user ? res.locals.user.id : null;

  TripObjs.findById(id, (err, trip) => {
    if (!trip || err || trip.removed_at) {
      return res.status(400).end();
    }
    const tripObj = trip.toObject({ getters: true });
    const { owner } = tripObj;
    const tripObjWithOwner = { ...tripObj, isOwner: owner === token };

    return res
      .status(200)
      .json(tripObjWithOwner)
      .end();
  });
});

router.get('/getName', (req, res) => {
  const { id } = req.query;
  const token = res.locals.user ? res.locals.user.id : null;
  TripObjs.findById(id, (err, trip) => {
    if (!trip || err || trip.removed_at) {
      return res.status(400).end();
    }
    const tripObj = { name: trip.name, isOwner: trip.owner === token };
    return res
      .status(200)
      .json(tripObj)
      .end();
  });
});

router.post('/save', (req, res) => {
  const token = res.locals.user ? res.locals.user.id : null;
  if (token === null) return res.status(403).end();

  const categories = req.body.categories.map(c => ({
    label: c.label || '',
    id: c.id !== undefined ? c.id : null,
    active: c.active || false
  }));
  const travelers = req.body.travelers.map(t => ({
    label: t.label || '',
    id: t.id !== undefined ? t.id : null,
    active: t.active || false
  }));

  const tripDetails = {
    name: req.body.name || '',
    categories,
    travelers,
    updated_at: new Date(),
    removed_at: null
  };

  const newTrip = TripObjs({ ...tripDetails, owner: token });

  if (req.body.id) {
    TripObjs.findById(req.body.id, (err, trip) => {
      if (err) throw err;
      if (trip.owner !== token) return res.status(403).end();
      trip.update(tripDetails, (errTripUpdate) => {
        if (errTripUpdate) throw err;
        return true;
      });
      return true;
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
  const token = res.locals.user ? res.locals.user.id : null;
  if (token === null) return res.status(403).end();

  TripObjs.findById(req.body.id, (err, trip) => {
    if (err) throw err;
    if (token === null || trip.owner !== token) return res.status(403).end();
    trip.update({ removed_at: new Date() }, (errTripUpdate) => {
      if (errTripUpdate) throw err;
      return res.status(200).end();
    });
    return true;
  });
  return true;
});

export default router;
