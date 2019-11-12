import express from 'express';
import Expense from '../models/expenses';
import TripObjs from '../models/trips';

const router = new express.Router();

router.get('/all', (req, res) => {
  const { id } = req.query;

  Expense.find({ tripId: id, removed_at: null }, (err, expenses) => {
    if (err) {
      return res.status(403).end();
    }
    return res
      .status(200)
      .json(expenses)
      .end();
  });
});

// fetch recent expenses
router.get('/recent', (req, res) => {
  const { id } = req.query;
  const { n = 3 } = req.query;
  Expense.find({ tripId: id, removed_at: null }, (err, expenses) => {
    if (err) return res.status(403).end();
    const recents = expenses.slice(-1 * n).reverse();
    return res
      .status(200)
      .json(recents)
      .end();
  });
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
            .json(expenseDetails)
            .end();
        });
      } else {
        // check the trip owner
        TripObjs.findById(expense.tripId, (errTrip, trip) => {
          // check to see if the token matches the trip owner
          if (trip.owner === token) {
            // we can update
            expense.update(expenseDetails, (errExpUpdate) => {
              if (errExpUpdate) throw err;
              return res
                .status(200)
                .json(expense)
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
      return res
        .status(200)
        .json(newExpense)
        .end();
    });
  }
});

router.post('/remove', (req, res) => {
  Expense.findOneAndRemove(
    {
      _id: req.body.id,
    },
    (err) => {
      if (err) throw err;
    }
  );

  return res.status(200).end();
});

export default router;
