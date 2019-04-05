import mongoose from 'mongoose';

const { Schema } = mongoose;

const expensesSchema = new Schema({
  tripId: String,
  date: Date,
  note: String,
  amount: Number,
  category: {
    name: String,
    id: String,
  },
  splitBy: [
    {
      id: String,
      name: String,
      checked: String,
    },
  ],
  paidBy: {
    name: String,
    id: String,
  },
  updated_at: Date,
});

expensesSchema.set('toJSON', { virtuals: true });

const Expenses = mongoose.model('Expense', expensesSchema);

export default Expenses;
