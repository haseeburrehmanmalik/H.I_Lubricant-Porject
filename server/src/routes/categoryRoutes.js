const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getCategories);
router.post('/admin', protect, adminOnly, createCategory);
router.put('/admin/:id', protect, adminOnly, updateCategory);
router.delete('/admin/:id', protect, adminOnly, deleteCategory);

module.exports = router;
