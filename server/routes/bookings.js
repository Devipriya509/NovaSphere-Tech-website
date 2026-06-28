const express = require('express');
const router = express.Router();
const {
  getMyBookings,
  getAllBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
  cancelBookingByUser,
  rescheduleBookingByUser
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

// User dashboard bookings
router.get('/my-bookings', protect, getMyBookings);
router.post('/', protect, createBooking);
router.put('/my-bookings/:id/cancel', protect, cancelBookingByUser);
router.put('/my-bookings/:id/reschedule', protect, rescheduleBookingByUser);

// Admin-only bookings manager
router.get('/', protect, adminOnly, getAllBookings);
router.put('/:id', protect, adminOnly, updateBookingStatus);
router.delete('/:id', protect, adminOnly, deleteBooking);

module.exports = router;
