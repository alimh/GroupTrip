import express from 'express';
import Expense from '../models/expenses';

const router = new express.Router();

router.get('/all', (req, res) => {
  Expense.find({ }, (err, expenses) => {
    if (err) {
      return res.status(403).end();
    }
    const expensesObj = expenses.map(exp => ({
      id: exp._id,
      date: exp.date,
      amount: exp.amount || '',
      note: exp.note || '',
      category: exp.category || {},
      splitBy: exp.splitBy || [],
      paidBy: exp.paidBy || {},
    }));

    return res.status(200).json(expensesObj).end();
  });
});

router.post('/new', (req, res) => {
  const newExpense = Expense({
    date: req.body.date,
    note: req.body.note,
    amount: req.body.amount,
    category: {
      name: req.body.categories.value,
      id: req.body.categories.key,
    },
    splitBy: req.body.users.reduce((acc, user) => {
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
    created_at: new Date(),
  });

  newExpense.save((err) => {
    if (err) throw err;
  });

  return res.status(200).end();
});

router.post('/update', (req, res) => {
  Expense.findByIdAndUpdate(
    req.body.id,
    {
      date: req.body.date,
      note: req.body.note,
      amount: req.body.amount,
      category: {
        name: req.body.categories.value,
        id: req.body.categories.key,
      },
      splitBy: req.body.users.reduce((acc, user) => {
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
    },
    (err) => {
      if (err) throw err;
    },
  );

  return res.status(200).end();
});

router.post('/remove', (req, res) => {
  Expense.findOneAndRemove({
    _id: req.body.id,
  }, (err) => {
    if (err) throw err;
  });

  return res.status(200).end();
});

export default router;
