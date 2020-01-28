import mongoose from 'mongoose';

const { Schema } = mongoose;

const userObjSchema = new Schema({
  email: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  reminderQuestion: {
    type: String,
    required: true,
  },
  reminderHash: {
    type: String,
    required: true,
  },
});

userObjSchema.set('toJSON', { virtuals: true });

const UserObjs = mongoose.model('UserObj', userObjSchema);

export default UserObjs;
