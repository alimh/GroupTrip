import express from 'express';
import Expense from '../models/expenses';

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

router.post('/save', (req, res) => {
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

  const newExpense = Expense({ ...expenseDetails });

  if (req.body.id) {
    Expense.findByIdAndUpdate(req.body.id, { ...expenseDetails }, (err) => {
      if (err) throw err;
    });
  } else {
    newExpense.save((err) => {
      if (err) throw err;
    });
  }

  return res
    .status(200)
    .json(req.body.id || newExpense.id)
    .end();
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
