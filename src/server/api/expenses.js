import express from 'express';
import Expense from '../models/expenses';
import Trip from '../models/trips';
import Log from '../models/log';

const router = new express.Router();

const writeToLog = (logObj) => {
  const logEntry = Log(logObj);
  logEntry.save((err) => {
    if (err) throw err;
  });
};

const getExpenses = (tripId, token, res, num = 0) => {
  // num: controls which expenses to get:
  //    -1: only incopmlete expenses
  //    0: all expenses
  //    n: capped at that number
  Expense.find({ tripId, removed_at: null }, (err, expenses) => {
    if (err) return res.status(504).end();

    const expObj = expenses.map(e => e.toObject({ getters: true }));

    // find trip owner
    Trip.findById(tripId, (errTrip, trip) => {
      if (errTrip) return res.status(504).end();

      const tripObj = trip.toObject({ getters: true });
      const tripOwner = tripObj.owner;

      const expObjWithOwner = expObj.map(e => ({
        ...e,
        canEdit: e.owner === token || tripOwner === token,
      }));
      const expNeedAttention = expObjWithOwner.filter(e => e.needsAttention && e.canEdit);
      const expNormal = expObjWithOwner.filter(e => !(e.needsAttention && e.canEdit));
      const expNormalTrunc =
        num > 0 ? expNormal.slice(-1 * num).reverse() : expNormal;
      const expReturn =
        num < 0
          ? [...expNeedAttention]
          : [...expNeedAttention, ...expNormalTrunc];

      return res
        .status(200)
        .json(expReturn)
        .end();
    });
    return true;
  });
};

router.get('/all', (req, res) => {
  const { id } = req.query;
  const token = req.headers.authorization.split(' ')[1] || null;

  getExpenses(id, token, res);
  return true;
});

// fetch recent expenses
router.get('/recent', (req, res) => {
  const { id } = req.query;
  const { n = 3 } = req.query;
  const token = req.headers.authorization.split(' ')[1] || null;

  getExpenses(id, token, res, n);
  return true;
});

router.get('/getone', (req, res) => {
  const { id } = req.query;
  const token = req.headers.authorization.split(' ')[1] || null;

  Expense.findById(id, (err, exp) => {
    if (err) return res.status(403).end();

    const expObj = exp.toObject({ getters: true });

    // find trip owner
    Trip.findById(expObj.tripId, (errTrip, trip) => {
      if (errTrip) return res.status(504).end();

      const tripObj = trip.toObject({ getters: true });
      const tripOwner = tripObj.owner;

      const expObjWithOwner = {
        ...expObj,
        canEdit: !expObj.removed_at
          ? expObj.owner === token || tripOwner === token
          : false,
      };

      return res
        .status(200)
        .json(expObjWithOwner)
        .end();
    });
    return true;
  });
  return true;
});
router.get('/incomplete', (req, res) => {
  const { id } = req.query;
  const token = req.headers.authorization.split(' ')[1] || null;

  getExpenses(id, token, res, -1);

  return true;
});

router.post('/save', (req, res) => {
  const token = req.headers.authorization.split(' ')[1] || null;
  const expenseDetails = {
    tripId: req.body.tripId,
    date: req.body.date,
    note: req.body.note,
    amount: req.body.amount,
    category: {
      name: req.body.category.value,
      id: req.body.category.key,
    },
    splitBy: req.body.splitBy.reduce((acc, user) => {
      if (user.checked) {
        acc.push({
          name: user.value,
          id: user.key,
        });
      }
      return acc;
    }, []),
    paidBy: {
      name: req.body.paidBy.value,
      id: req.body.paidBy.key,
    },
    updated_at: new Date(),
    removed_at: null,
  };

  const newExpense = Expense({ ...expenseDetails, owner: token });

  if (req.body.id) {
    // if we are updating an expense
    Expense.findById(req.body.id, (err, expense) => {
      // check to see if owner exists for this expennse and if it doesn't match
      if (expense.owner === null || expense.owner === token) {
        // we can update
        expense.update(expenseDetails, (errExpUpdate) => {
          if (errExpUpdate) throw err;
          return res
            .status(200)
            .json(expense.id)
            .end();
        });
      } else {
        // check the trip owner
        Trip.findById(expense.tripId, (errTrip, trip) => {
          // check to see if the token matches the trip owner
          if (trip.owner === token) {
            // we can update
            expense.update(expenseDetails, (errExpUpdate) => {
              if (errExpUpdate) throw err;
              return res
                .status(200)
                .json(expense.id)
                .end();
            });
          } else {
            // send 403
            return res.status(403).end();
          }
          return true;
        });
      }
    });
  } else {
    newExpense.save((err) => {
      if (err) throw err;
      // write to log
      writeToLog({
        tripId: expenseDetails.tripId,
        expenseId: newExpense.id,
        userId: token,
        action: 'added',
        note: newExpense.note,
        timestamp: new Date(),
      });

      return res
        .status(200)
        .json(newExpense.id)
        .end();
    });
  }
});

router.post('/remove', (req, res) => {
  const token = req.headers.authorization.split(' ')[1] || null;
  Expense.findById(req.body.id, (err, expense) => {
    // check to see if owner exists for this expennse and if it doesn't match
    if (expense.owner === null || expense.owner === token) {
      // we can update
      expense.update({ removed_at: new Date() }, (errExpUpdate) => {
        if (errExpUpdate) throw err;
        // write to log
        writeToLog({
          tripId: expense.tripId,
          expenseId: expense.id,
          userId: token,
          action: 'removed',
          note: expense.note,
          timestamp: new Date(),
        });
        return res.status(200).end();
      });
    } else {
      // check the trip owner
      Trip.findById(expense.tripId, (errTrip, trip) => {
        // check to see if the token matches the trip owner
        if (trip.owner === token) {
          // we can update
          expense.update({ removed_at: new Date() }, (errExpUpdate) => {
            if (errExpUpdate) throw err;
            // write to log
            writeToLog({
              tripId: expense.tripId,
              expenseId: expense.id,
              userId: token,
              action: 'removed',
              note: expense.note,
              timestamp: new Date(),
            });

            return res.status(200).end();
          });
        } else {
          // send 403
          return res.status(403).end();
        }
        return true;
      });
    }
  });
});

export default router;
