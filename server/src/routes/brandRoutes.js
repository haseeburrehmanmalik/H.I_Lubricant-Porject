const express = require('express');
const router = express.Router();
const {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} = require('../controllers/brandController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getBrands);
router.post('/admin', protect, adminOnly, createBrand);
router.put('/admin/:id', protect, adminOnly, updateBrand);
router.delete('/admin/:id', protect, adminOnly, deleteBrand);

module.exports = router;
