// donorController.js

const db = require('../config/db'); // Import the MySQL connection

// Function to get donation history for a donor
const getDonationHistory = (donorId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT donation_date, blood_type, location, status, response_date, comments 
      FROM donations 
      WHERE donor_id = ?
    `;

    db.query(query, [donorId], (error, results) => {
      if (error) {
        console.error('Error fetching donation history:', error);
        return reject({ error: 'Database error' });
      }
      resolve(results);
    });
  });
};

// Function to get request history for a donor
const getRequestHistory = (donorId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT request_date, blood_type, units, purpose, location, status, response_date, comments 
      FROM requests 
      WHERE donor_id = ?
    `;

    db.query(query, [donorId], (error, results) => {
      if (error) {
        console.error('Error fetching request history:', error);
        return reject({ error: 'Database error' });
      }
      resolve(results);
    });
  });
};

module.exports = {
  getDonationHistory,
  getRequestHistory,
};
