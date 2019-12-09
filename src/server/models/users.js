import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const { Schema } = mongoose;

const userObjSchema = new Schema({
  name: String,
  email: String,
  hash: String,
  salt: String,
});

userObjSchema.set('toJSON', { virtuals: true });

userObjSchema.methods.setPassword = function (password) {
  this.hash = password;
};
userObjSchema.methods.validatePassword = function (password) {
  return password === this.hash;
};
userObjSchema.methods.generateJwt = function () {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      name: this.name,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    },
    'secret'
  );
};
userObjSchema.methods.toAuthJson = function () {
  return {
    id: this._id,
    name: this.name,
    token: this.generateJwt(),
  };
};

const UserObjs = mongoose.model('UserObj', userObjSchema);

export default UserObjs;