const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, default: 5 },
  avatar: { type: String, default: '' }
}, { timestamps: true });

const TestimonialMongoose = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
module.exports = getModel('Testimonial', TestimonialMongoose);
