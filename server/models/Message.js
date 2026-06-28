const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

const MessageMongoose = mongoose.models.Message || mongoose.model('Message', MessageSchema);
module.exports = getModel('Message', MessageMongoose);
