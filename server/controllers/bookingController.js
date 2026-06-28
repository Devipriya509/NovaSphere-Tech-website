const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { sendBookingConfirmation, sendBookingStatusUpdate } = require('../config/emailService');

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Appointment.find({ userId: req.user._id.toString() });
    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    next(err);
  }
};

const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Appointment.find();
    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    next(err);
  }
};

const createBooking = async (req, res, next) => {
  try {
    const { service, date, time, name, email, phone, details, message } = req.body;
    if (!service || !date || !time || !name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'All booking fields except details are required' });
    }

    const userId = req.user ? req.user._id.toString() : null;

    const booking = await Appointment.create({
      userId,
      service,
      date,
      time,
      name,
      email,
      phone,
      details: details || message || '',
      status: 'Pending'
    });

    // If registered user is booking, send them an in-app notification
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        const notifications = user.notifications || [];
        notifications.unshift({
          id: Math.random().toString(36).substr(2, 9),
          title: 'Appointment Booking Request',
          message: `Your booking request for "${service}" on ${date} at ${time} has been received. Our team will verify it shortly.`,
          read: false,
          createdAt: new Date().toISOString()
        });
        await User.findByIdAndUpdate(userId, { notifications });
      }
    }

    sendBookingConfirmation(booking);

    res.status(201).json({ success: true, message: 'Appointment booked successfully', booking });
  } catch (err) {
    next(err);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Pending', 'Confirmed', 'Cancelled'
    if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid booking status' });
    }

    const booking = await Appointment.findByIdAndUpdate(id, { status });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Notify user if registered
    if (booking.userId) {
      const user = await User.findById(booking.userId);
      if (user) {
        const notifications = user.notifications || [];
        notifications.unshift({
          id: Math.random().toString(36).substr(2, 9),
          title: `Booking Status: ${status}`,
          message: `Your appointment booking for "${booking.service}" on ${booking.date} at ${booking.time} is now ${status.toLowerCase()}.`,
          read: false,
          createdAt: new Date().toISOString()
        });
        await User.findByIdAndUpdate(booking.userId, { notifications });
      }
    }

    sendBookingStatusUpdate(booking, status);

    res.status(200).json({ success: true, message: `Booking status updated to ${status}` });
  } catch (err) {
    next(err);
  }
};

const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Appointment.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Appointment booking not found' });
    }
    res.status(200).json({ success: true, message: 'Booking deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const cancelBookingByUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Appointment.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.userId !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    await Appointment.findByIdAndUpdate(id, { status: 'Cancelled' });
    
    const user = await User.findById(req.user._id);
    if (user) {
      const notifications = user.notifications || [];
      notifications.unshift({
        id: Math.random().toString(36).substr(2, 9),
        title: 'Booking Cancelled',
        message: `Your booking for "${booking.service}" on ${booking.date} has been cancelled successfully.`,
        read: false,
        createdAt: new Date().toISOString()
      });
      await User.findByIdAndUpdate(req.user._id, { notifications });
    }

    sendBookingStatusUpdate(booking, 'Cancelled');

    res.status(200).json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (err) {
    next(err);
  }
};

const rescheduleBookingByUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;
    if (!date || !time) {
      return res.status(400).json({ success: false, message: 'Reschedule date and time are required' });
    }

    const booking = await Appointment.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.userId !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to reschedule this booking' });
    }

    await Appointment.findByIdAndUpdate(id, { date, time, status: 'Pending' });

    const user = await User.findById(req.user._id);
    if (user) {
      const notifications = user.notifications || [];
      notifications.unshift({
        id: Math.random().toString(36).substr(2, 9),
        title: 'Booking Rescheduled',
        message: `Your booking for "${booking.service}" has been rescheduled to ${date} at ${time}. Status is pending review.`,
        read: false,
        createdAt: new Date().toISOString()
      });
      await User.findByIdAndUpdate(req.user._id, { notifications });
    }

    sendBookingStatusUpdate(booking, 'Rescheduled');

    res.status(200).json({ success: true, message: 'Reschedule request submitted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyBookings,
  getAllBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
  cancelBookingByUser,
  rescheduleBookingByUser
};
