// recipientRoutes.js
const express = require('express');
const router = express.Router();
const recipientController = require('../controllers/recipientController');

// Routes for recipient operations
router.get('/request-history/:recipientId', recipientController.getRequestHistory);
router.post('/add-request', recipientController.addBloodRequest);
router.get('/request-counts/:recipientId', recipientController.getRequestCounts);

module.exports = router;
