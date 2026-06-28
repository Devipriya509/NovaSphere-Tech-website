const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const AppointmentSchema = new mongoose.Schema({
  userId: { type: String, default: null }, // Link to registered user if logged in
  service: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  time: { type: String, required: true }, // Format: HH:MM
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  details: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
  paymentStatus: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
  razorpayOrderId: { type: String, default: '' },
  razorpayPaymentId: { type: String, default: '' },
  amountPaid: { type: Number, default: 0 }
}, { timestamps: true });

const AppointmentMongoose = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
module.exports = getModel('Appointment', AppointmentMongoose);
