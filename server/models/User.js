const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String, default: '' },
  isBlocked: { type: Boolean, default: false },
  savedProjects: [{ type: String }],
  savedServices: [{ type: String }],
  notifications: [{
    id: { type: String },
    title: { type: String },
    message: { type: String },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const UserMongoose = mongoose.models.User || mongoose.model('User', UserSchema);
module.exports = getModel('User', UserMongoose);
