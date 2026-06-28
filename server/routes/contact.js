const express = require('express');
const router = express.Router();
const {
  submitContactForm,
  getContactMessages,
  toggleMessageReadStatus,
  subscribeNewsletter,
  getNewsletterSubscribers,
  deleteContactMessage
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', submitContactForm);
router.post('/newsletter', subscribeNewsletter);

// Admin-only contact reviewing
router.get('/', protect, adminOnly, getContactMessages);
router.put('/messages/:id', protect, adminOnly, toggleMessageReadStatus);
router.delete('/messages/:id', protect, adminOnly, deleteContactMessage);
router.get('/newsletter', protect, adminOnly, getNewsletterSubscribers);

module.exports = router;
