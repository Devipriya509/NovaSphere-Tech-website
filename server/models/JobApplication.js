const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const JobApplicationSchema = new mongoose.Schema({
  careerId: { type: String, required: true },
  jobTitle: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  coverLetter: { type: String, default: '' },
  resume: { type: String, required: true }, // Local file path or base64 data URL
  status: { type: String, enum: ['Pending', 'Reviewed', 'Shortlisted', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

const JobApplicationMongoose = mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema);
module.exports = getModel('JobApplication', JobApplicationMongoose);
