const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserVerificationSchema = Schema({
  userId: String,
  uniqueString: String,
  createdAt: Date,
  expiresAt: Date,
});

const UserVerification = mongoose.model('UserVerification', UserVerificationSchema);

module.exports = UserVerification;
