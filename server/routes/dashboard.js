const express = require('express');
const router = express.Router();
const { getAdminAnalytics } = require('../controllers/dashboardController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/analytics', protect, adminOnly, getAdminAnalytics);

module.exports = router;
