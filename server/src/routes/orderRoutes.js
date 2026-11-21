const express = require('express');
const router = express.Router();
const {
  createOrder,
  trackOrder,
  getOrderByOrderNumber,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  updateTrackingDetails,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

// Public checkout & customer tracking
router.post('/', createOrder);
router.post('/track', trackOrder);
router.get('/lookup/:orderNumber', getOrderByOrderNumber);

// Admin order management routes (Protected)
router.get('/admin', protect, adminOnly, getOrders);
router.get('/admin/:id', protect, adminOnly, getOrderById);
router.patch('/admin/:id/status', protect, adminOnly, updateOrderStatus);
router.patch('/admin/:id/payment', protect, adminOnly, updatePaymentStatus);
router.patch('/admin/:id/tracking', protect, adminOnly, updateTrackingDetails);

module.exports = router;
