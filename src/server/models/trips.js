import mongoose from 'mongoose';

const { Schema } = mongoose;

const tripObjSchema = new Schema({
  name: String,
  categories: [String],
  travelers: [String],
  updated_at: Date,
  removed_at: Date,
});

tripObjSchema.set('toJSON', { virtuals: true });

const TripObjs = mongoose.model('TripObj', tripObjSchema);

export default TripObjs;
