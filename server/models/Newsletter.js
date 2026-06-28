const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const NewsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
}, { timestamps: true });

const NewsletterMongoose = mongoose.models.Newsletter || mongoose.model('Newsletter', NewsletterSchema);
module.exports = getModel('Newsletter', NewsletterMongoose);
