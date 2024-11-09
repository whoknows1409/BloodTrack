const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');

// Essential routes that match your current implementation
router.get('/donation-history/:donorId', donorController.getDonationHistory);
router.post('/add-donation', donorController.addDonationRequest);

// New routes for donation and request counts
router.get('/donation-counts/:donorId', donorController.getDonationCounts);

router.get('/details/:donorId', donorController.getDonorDetails);

module.exports = router;