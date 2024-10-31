// backend/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController'); // Import the entire authController

const router = express.Router();

// Admin login route
router.post('/admin/login', authController.loginAdmin);

// Donor login route
router.post('/donor/login', authController.loginDonor);

// Donor register route
router.post('/donor/register', authController.registerDonor); // Corrected to use authController

// Recipient login route
router.post('/recipient/login', authController.loginRecipient);

// Recipient register route
router.post('/recipient/register', authController.registerRecipient);

module.exports = router;
