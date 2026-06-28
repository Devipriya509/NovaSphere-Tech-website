const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const PortfolioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true }, // e.g. 'Web Development', 'Mobile Apps', 'AI', 'Branding', 'UI UX'
  technologies: [{ type: String }],
  client: { type: String, required: true },
  liveDemo: { type: String, default: '' },
  github: { type: String, default: '' }
}, { timestamps: true });

const PortfolioMongoose = mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);
module.exports = getModel('Portfolio', PortfolioMongoose);
