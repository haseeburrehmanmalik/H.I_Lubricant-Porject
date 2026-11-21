const express = require('express');
const router = express.Router();
const {
  login,
  logout,
  getMe,
  updateProfile,
  getAccountInfo,
  changeEmail,
  changePassword,
  logoutAllSessions,
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');

// Public auth routes
router.post('/login', login);

// Private profile routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);

// Admin Account & Security Management routes
router.get('/settings/account', protect, adminOnly, getAccountInfo);
router.put('/settings/email', protect, adminOnly, changeEmail);
router.put('/settings/password', protect, adminOnly, changePassword);
router.post('/settings/logout-all', protect, adminOnly, logoutAllSessions);

module.exports = router;
