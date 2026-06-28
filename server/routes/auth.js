const express = require('express');
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  changePassword,
  toggleSaveProject,
  clearNotification,
  deleteUser,
  toggleBlockUser,
  updateUserByAdmin,
  toggleSaveService,
  deleteMyAccount
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/toggle-project', protect, toggleSaveProject);
router.post('/toggle-service', protect, toggleSaveService);
router.delete('/me', protect, deleteMyAccount);
router.put('/notifications/:id', protect, clearNotification);

// Admin-only User actions
router.put('/users/:id', protect, adminOnly, updateUserByAdmin);
router.delete('/users/:id', protect, adminOnly, deleteUser);
router.put('/users/:id/block', protect, adminOnly, toggleBlockUser);

module.exports = router;
