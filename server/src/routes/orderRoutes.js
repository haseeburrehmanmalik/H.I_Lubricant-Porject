const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderByOrderNumber,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

// Public checkout & verification
router.post('/', createOrder);
router.get('/lookup/:orderNumber', getOrderByOrderNumber);

// Admin routes
router.get('/admin', protect, adminOnly, getOrders);
router.get('/admin/:id', protect, adminOnly, getOrderById);
router.patch('/admin/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
