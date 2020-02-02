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

const formatMoney = (a) => '$ '.concat(a.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
});

const reduceSplitBy = (s) => s.reduce((acc, i) => acc.concat(i.name).concat(', '), '').slice(0, -2);

const getExpenses = (tripId, userId, res, num = 0) => {
  // num: controls which expenses to get:
  //    -1: only incopmlete expenses
  //    0: all expenses
  //    n: capped at that number
  Expense.find({ tripId, removed_at: null }, (err, expenses) => {
    if (err) return res.status(500).end();

    const expObj = expenses.map((e) => e.toObject({ getters: true }));

    // find trip owner
    Trip.findById(tripId, (errTrip, trip) => {
      if (errTrip) return res.status(500).end();

      const tripObj = trip.toObject({ getters: true });
      const tripOwner = tripObj.owner;

      const expObjWithOwner = expObj.map((e) => ({
        ...e,
        canEdit: e.owner === userId || tripOwner === userId || e.owner === null,
      }));
      const expNeedAttention = expObjWithOwner.filter((e) => e.needsAttention && e.canEdit);
      const expNormal = expObjWithOwner.filter((e) => !(e.needsAttention && e.canEdit));
      const expNormalTrunc = num > 0 ? expNormal.slice(-1 * num).reverse() : expNormal;
      const expReturn = num < 0
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
  const userId = res.locals.user ? res.locals.user.id : null;

  getExpenses(id, userId, res);
  return true;
});

// fetch recent expenses
router.get('/recent', (req, res) => {
  const { id } = req.query;
  const { n = 3 } = req.query;
  const userId = res.locals.user ? res.locals.user.id : null;

  getExpenses(id, userId, res, n);
  return true;
});

router.get('/getone', (req, res) => {
  const { id } = req.query;
  const userId = res.locals.user ? res.locals.user.id : null;

  Expense.findById(id, (err, exp) => {
    if (err) return res.status(500).end();
    if (!exp) {
      return res
        .status(500)
        .send('Not found')
        .end();
    }
    const expObj = exp.toObject({ getters: true });

    // find trip owner
    Trip.findById(expObj.tripId, (errTrip, trip) => {
      if (errTrip) return res.status(500).end();

      const tripObj = trip.toObject({ getters: true });
      const tripOwner = tripObj.owner;

      const expObjWithOwner = {
        ...expObj,
        canEdit: !expObj.removed_at
          ? expObj.owner === userId || tripOwner === userId
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
  const userId = res.locals.user ? res.locals.user.id : null;

  getExpenses(id, userId, res, -1);

  return true;
});

router.post('/save', async (req, res) => {
  const userId = res.locals.user ? res.locals.user.id : null;
  const userName = res.locals.user ? res.locals.user.name : null;
  const { tripId } = req.body;
  const expenseId = req.body.id || null;

  const expenseDetails = {
    tripId,
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

  const entry = {
    tripId,
    userId,
    userName,
    expenseId,
    action: expenseId ? 'updated' : 'added',
    timestamp: new Date(),
  };

  const changes = [];
  try {
    const trip = await Trip.findById(tripId);

    if (expenseId) {
      const expense = await Expense.findById(expenseId);

      if (expense.owner !== userId && trip.owner !== userId) {
        return res
          .status(403)
          .send("You don't have permission to access")
          .end();
      }

      if (expenseDetails.note !== expense.note) {
        changes.push({
          item: 'Note',
          oldValue: expense.note,
          newValue: expenseDetails.note,
        });
      }
      if (expenseDetails.amount !== expense.amount) {
        changes.push({
          item: 'Amount',
          oldValue: expense.amount
            ? formatMoney(parseFloat(expense.amount))
            : '',
          newValue: expenseDetails.amount
            ? formatMoney(parseFloat(expenseDetails.amount))
            : '',
        });
      }
      if (expense.category.name !== expenseDetails.category.name) {
        changes.push({
          item: 'Category',
          oldValue: expense.category.name,
          newValue: expenseDetails.category.name,
        });
      }
      if (expense.paidBy.name !== expenseDetails.paidBy.name) {
        changes.push({
          item: 'Paid By',
          oldValue: expense.paidBy.name,
          newValue: expenseDetails.paidBy.name,
        });
      }
      if (formatDate(expense.date) !== formatDate(expenseDetails.date)) {
        changes.push({
          item: 'Date',
          oldValue: formatDate(expense.date),
          newValue: formatDate(expenseDetails.date),
        });
      }
      if (
        reduceSplitBy(expense.splitBy) !== reduceSplitBy(expenseDetails.splitBy)
      ) {
        changes.push({
          item: 'Split By',
          oldValue: reduceSplitBy(expense.splitBy),
          newValue: reduceSplitBy(expenseDetails.splitBy),
        });
      }

      await expense.update(expenseDetails);
    } else {
      // new expense
      const newExpense = Expense({
        ...expenseDetails,
        owner: userId || trip.owner,
      });
      const newExp = await newExpense.save();
      entry.expenseId = newExp.id;
      // if (!userId) {
      //   changes.push({ item: 'Owner', oldValue: userName, newValue: trip.owner });
      // }
    }

    entry.note = changes.reduce(
      (acc, c) => (c.item === 'Note' ? c.oldValue : acc),
      expenseDetails.note,
    );
    entry.changes = changes;

    writeToLog(entry);
    // write changes to log
  } catch (err) {
    return res
      .status(500)
      .send(err)
      .end();
  }
  return res.status(200).end();
});
//   const newExpense = Expense({ ...expenseDetails, owner: userId });

//   // are we updateing an existing expense or creating a new expense?
//   if (req.body.id) {
//     // if we are updating an expense
//     Expense.findById(req.body.id, (err, expense) => {
//       if (err) {
//         return res
//           .status(500)
//           .send(err)
//           .end();
//       }

//       const changes = [];
//       if (expenseDetails.note !== expense.note) {
//         changes.push({
//           item: 'Note',
//           oldValue: expense.note,
//           newValue: expenseDetails.note
//         });
//       }
//       if (expenseDetails.amount !== expense.amount) {
//         changes.push({
//           item: 'Amount',
//           oldValue: expense.amount
//             ? formatMoney(parseFloat(expense.amount))
//             : '',
//           newValue: expenseDetails.amount
//             ? formatMoney(parseFloat(expenseDetails.amount))
//             : ''
//         });
//       }
//       if (expense.category.name !== expenseDetails.category.name) {
//         changes.push({
//           item: 'Category',
//           oldValue: expense.category.name,
//           newValue: expenseDetails.category.name
//         });
//       }
//       if (expense.paidBy.name !== expenseDetails.paidBy.name) {
//         changes.push({
//           item: 'Paid By',
//           oldValue: expense.paidBy.name,
//           newValue: expenseDetails.paidBy.name
//         });
//       }
//       if (formatDate(expense.date) !== formatDate(expenseDetails.date)) {
//         changes.push({
//           item: 'Date',
//           oldValue: formatDate(expense.date),
//           newValue: formatDate(expenseDetails.date)
//         });
//       }
//       if (
//         reduceSplitBy(expense.splitBy) !== reduceSplitBy(expenseDetails.splitBy)
//       ) {
//         changes.push({
//           item: 'Split By',
//           oldValue: reduceSplitBy(expense.splitBy),
//           newValue: reduceSplitBy(expenseDetails.splitBy)
//         });
//       }

//       const entry = {
//         tripId: expense.tripId,
//         expenseId: expense.id,
//         userId,
//         userName,
//         action: 'updated',
//         note: expense.note,
//         timestamp: new Date(),
//         changes
//       };

//       // check to see if owner exists for this expennse and if it doesn't match
//       if (expense.owner === null || expense.owner === userId) {
//         // we can update
//         expense.update(expenseDetails, (errExpUpdate) => {
//           if (errExpUpdate) {
//             return res
//               .status(500)
//               .send(errExpUpdate)
//               .end();
//           }
//           if (changes.length > 0) writeToLog(entry);
//           return res
//             .status(200)
//             .json(expense.id)
//             .end();
//         });
//       } else {
//         // check the trip owner
//         Trip.findById(expense.tripId, (errTrip, trip) => {
//           // check to see if the token matches the trip owner
//           if (trip.owner === userId) {
//             // we can update
//             expense.update(expenseDetails, (errExpUpdate) => {
//               if (errExpUpdate) {
//                 res
//                   .status(500)
//                   .send(errExpUpdate)
//                   .end();
//               }
//               if (changes.length > 0) writeToLog(entry);
//               return res
//                 .status(200)
//                 .json(expense.id)
//                 .end();
//             });
//           } else {
//             // send 403
//             return res
//               .status(403)
//               .send('You are not authorized to update.')
//               .end();
//           }
//           return true;
//         });
//       }
//       return true;
//     });
//   } else {
//     newExpense.save((err) => {
//       if (err) {
//         return res
//           .status(500)
//           .send(err)
//           .end();
//       }
//       // write to log
//       writeToLog({
//         tripId: expenseDetails.tripId,
//         expenseId: newExpense.id,
//         userId,
//         userName,
//         action: 'added',
//         note: newExpense.note,
//         timestamp: new Date()
//       });

//       return res
//         .status(200)
//         .json(newExpense.id)
//         .end();
//     });
//   }
// });

router.post('/remove', (req, res) => {
  const userId = res.locals.user ? res.locals.user.id : null;
  const userName = res.locals.user ? res.locals.user.name : null;

  Expense.findById(req.body.id, (err, expense) => {
    // check to see if owner exists for this expennse and if it doesn't match
    if (expense.owner === null || expense.owner === userId) {
      // we can update
      expense.updateOne({ removed_at: new Date() }, (errExpUpdate) => {
        if (errExpUpdate) throw err;
        // write to log
        writeToLog({
          tripId: expense.tripId,
          expenseId: expense.id,
          userId,
          userName,
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
        if (trip.owner === userId) {
          // we can update
          expense.updateOne({ removed_at: new Date() }, (errExpUpdate) => {
            if (errExpUpdate) throw err;
            // write to log
            writeToLog({
              tripId: expense.tripId,
              expenseId: expense.id,
              userId,
              userName,
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
