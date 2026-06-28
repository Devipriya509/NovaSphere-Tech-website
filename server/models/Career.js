const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const CareerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true }, // e.g. 'Engineering', 'Marketing', 'Design'
  location: { type: String, required: true }, // e.g. 'Remote', 'New York, NY'
  type: { type: String, required: true }, // e.g. 'Full-time', 'Contract'
  salary: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  responsibilities: [{ type: String }]
}, { timestamps: true });

const CareerMongoose = mongoose.models.Career || mongoose.model('Career', CareerSchema);
module.exports = getModel('Career', CareerMongoose);
