const express = require('express');
const router = express.Router();
const { submitContact, getContactMessages } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', submitContact);
router.get('/admin', protect, adminOnly, getContactMessages);

module.exports = router;
