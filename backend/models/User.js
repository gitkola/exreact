const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = Schema({
  email: String,
  password: String,
  verified: Boolean,
  token: String,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
