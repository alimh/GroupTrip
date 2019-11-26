import mongoose from 'mongoose';

const { Schema } = mongoose;

const logObjSchema = new Schema({
  tripId: String,
  expenseId: String,
  userId: String,
  action: String,
  note: String,
  changes: [
    {
      item: String,
      oldValue: String,
      newValue: String,
    },
  ],
  timestamp: Date,
});

logObjSchema.set('toJSON', { virtuals: true });

const LogObjs = mongoose.model('LogObj', logObjSchema);

export default LogObjs;
