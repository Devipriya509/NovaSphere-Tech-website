const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  features: [{ type: String }],
  technologies: [{ type: String }],
  pricing: { type: String, required: true },
  icon: { type: String, default: 'Cpu' } // Lucide React icon name
}, { timestamps: true });

const ServiceMongoose = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
module.exports = getModel('Service', ServiceMongoose);
