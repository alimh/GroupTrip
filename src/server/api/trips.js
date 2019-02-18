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
  console.log('from /trips/get');
  console.log(id);
  TripObjs.findById(id, (err, trip) => {
    if (!trip || err) {
      return res.status(403).end();
    }
    return res
      .status(200)
      .json(trip.toObject({ getters: true }))
      .end();
  });
});

router.post('/save', (req, res) => {
  const tripDetails = {
    name: req.body.name,
    categories: req.body.categories,
    travelers: req.body.travelers,
    updated_at: new Date(),
    removed_at: null,
  };

  const newTrip = TripObjs({
    ...tripDetails,
  });

  console.log('from /trips/new');
  console.log(req.body);

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

// router.post('/remove', (req, res) => {
//   Settings.findOneAndUpdate(
//     {
//       _id: req.body.id,
//     },
//     { removed_at: new Date() },
//     (err) => {
//       if (err) throw err;
//     }
//   );

//   return res.status(200).end();
// });

export default router;
