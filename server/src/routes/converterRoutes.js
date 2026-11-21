const express = require('express');
const router = express.Router();
const converterController = require('../controllers/converterController');
const { protect, adminOnly } = require('../middleware/auth');

// Public customer routes
router.get('/oil-converters', converterController.getPublicConverters);
router.get('/oil-converters/:id', converterController.getConverterById);

// Admin routes (Unlimited dynamic converter management)
router.get(
  '/admin/oil-converters',
  protect,
  adminOnly,
  converterController.getAdminConverters
);

router.post(
  '/admin/oil-converters',
  protect,
  adminOnly,
  converterController.createConverter
);

router.put(
  '/admin/oil-converters/:id',
  protect,
  adminOnly,
  converterController.updateConverter
);

router.patch(
  '/admin/oil-converters/:id/status',
  protect,
  adminOnly,
  converterController.toggleConverterStatus
);

router.delete(
  '/admin/oil-converters/:id',
  protect,
  adminOnly,
  converterController.deleteConverter
);

module.exports = router;
