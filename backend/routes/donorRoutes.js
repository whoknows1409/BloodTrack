// donorRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Import the MySQL connection

// Route to fetch donation history for a donor
router.get('/donation-history/:donorId', (req, res) => {
  const donorId = req.params.donorId;
  const query = `
    SELECT donation_date, blood_type, location, status, response_date, comments 
    FROM donations 
    WHERE donor_id = ?
  `;

  db.query(query, [donorId], (error, results) => {
    if (error) {
      console.error('Error fetching donation history:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Route to fetch request history for a donor
router.get('/request-history/:donorId', (req, res) => {
  const donorId = req.params.donorId;
  const query = `
    SELECT request_date, blood_type, units, purpose, location, status, response_date, comments 
    FROM requests 
    WHERE donor_id = ?
  `;

  db.query(query, [donorId], (error, results) => {
    if (error) {
      console.error('Error fetching request history:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

module.exports = router;
