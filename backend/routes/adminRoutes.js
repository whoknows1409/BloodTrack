// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Update these routes to match the frontend requests
router.get('/blood-stock', adminController.getBloodStock);
router.post('/blood-stock', adminController.updateBloodStock);
router.get('/donors', adminController.getDonors);
router.get('/recipients', adminController.getRecipients);
router.get('/donation-requests', adminController.getDonationRequests);
router.put('/donation-requests/:id', adminController.approveDonation);
router.get('/blood-requests', adminController.getBloodRequests);
router.put('/blood-requests/:id', adminController.approveBloodRequest);
router.get('/request-history', adminController.getRequestHistory);
router.put('/blood-requests/:id/approve', adminController.approveBloodRequest);
router.put('/blood-requests/:id/reject', adminController.rejectBloodRequest);
module.exports = router;