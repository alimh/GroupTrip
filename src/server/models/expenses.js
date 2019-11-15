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
  removed_at: Date,
  owner: String,
});

expensesSchema.virtual('dateFormatted').get(function () {
  return this.date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
});
expensesSchema.virtual('amountFormatted').get(function () {
  return '$ '.concat(this.amount);
});

expensesSchema.virtual('needsAttention').get(function () {
  return (
    this.date === null ||
    this.amount === null ||
    this.note === '' ||
    this.splitBy.length === 0 ||
    this.category.id === '' ||
    this.paidBy === ''
  );
});

expensesSchema.set('toJSON', { virtuals: true });

const Expenses = mongoose.model('Expense', expensesSchema);

export default Expenses;
