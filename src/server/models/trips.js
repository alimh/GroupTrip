import mongoose from 'mongoose';

const { Schema } = mongoose;

const tripObjSchema = new Schema({
  name: String,
  categories: [
    {
      label: String,
      id: String,
      active: Boolean,
    },
  ],
  travelers: [
    {
      label: String,
      id: String,
      active: Boolean,
    },
  ],
  updated_at: Date,
  removed_at: Date,
  owner: String,
});

tripObjSchema.set('toJSON', { virtuals: true });

const TripObjs = mongoose.model('TripObj', tripObjSchema);

export default TripObjs;
