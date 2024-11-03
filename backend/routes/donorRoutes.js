const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');

// Essential routes that match your current implementation
router.get('/donation-history/:donorId', donorController.getDonationHistory);
router.get('/request-history/:donorId', donorController.getRequestHistory);
router.post('/add-donation', donorController.addDonationRequest);
router.post('/add-request', donorController.addBloodRequest);

module.exports = router;