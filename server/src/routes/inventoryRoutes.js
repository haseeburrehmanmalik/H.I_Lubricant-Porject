const express = require('express');
const router = express.Router();
const {
  getInventory,
  adjustStock,
  getTransactions,
} = require('../controllers/inventoryController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, getInventory);
router.patch('/:productId', protect, adminOnly, adjustStock);
router.get('/transactions', protect, adminOnly, getTransactions);

module.exports = router;
