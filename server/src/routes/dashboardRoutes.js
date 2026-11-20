const express = require('express');
const router = express.Router();
const {
  getDashboardSummary,
  getSalesChart,
  getRecentActivity,
} = require('../controllers/dashboardController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/summary', protect, adminOnly, getDashboardSummary);
router.get('/sales', protect, adminOnly, getSalesChart);
router.get('/recent-orders', protect, adminOnly, getRecentActivity);

module.exports = router;
