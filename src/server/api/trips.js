import express from 'express';
import TripObjs from '../models/trips';
import Expenses from '../models/expenses';

const router = new express.Router();

router.get('/all', async (req, res) => {
  const token = res.locals.user ? res.locals.user.id : null;

  try {
    const tripsOwn = await TripObjs.find({ removed_at: null, owner: token });
    const tripsOwnSlim = tripsOwn.map(t => ({ id: t.id, name: t.name }));

    const expensesContribute = await Expenses.find({
      removed_at: null,
      owner: token
    });

    const expensesUnique = expensesContribute.reduce((acc, t) => {
      const matchInTripsOwn = tripsOwn.reduce(
        (matchT, mt) => (mt.id === t.tripId ? true : matchT),
        false
      );
      if (matchInTripsOwn) return acc;
      const temp = acc;
      const matchInAcc = temp.reduce(
        (matchA, ma) => (ma === t.tripId ? true : matchA),
        false
      );
      if (matchInAcc) return acc;

      temp.push(t.tripId);
      return temp;
    }, []);

    const tripsContributePromises = expensesUnique.map(e =>
      TripObjs.findById(e));

    const tripsContributeSlim = [];
    await Promise.all(tripsContributePromises).then((trips) => {
      trips.forEach((t) => {
        if (!t.removed_at) tripsContributeSlim.push({ id: t.id, name: t.name });
      });
    });

    return res
      .status(200)
      .json({ own: tripsOwnSlim, contribute: tripsContributeSlim })
      .end();
  } catch (err) {
    return res
      .status(500)
      .send(err)
      .end();
  }
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
