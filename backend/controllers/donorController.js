// donorController.js
const db = require('../config/db');

// Function to get donation history for a donor
const getDonationHistory = (donorId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT donation_date, blood_type, location, status, response_date, comments
            FROM donations
            WHERE donor_id = ?
            ORDER BY donation_date DESC
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
            ORDER BY request_date DESC
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

// Function to add a donation request
const addDonationRequest = (donorId, donationData) => {
    return new Promise((resolve, reject) => {
        console.log('Processing donation request:', { donorId, donationData });
        
        // Validate required fields
        if (!donorId || !donationData || !donationData.donation_date || !donationData.blood_type || !donationData.location) {
            console.error('Missing required fields:', { donorId, donationData });
            return reject({ error: 'Missing required fields' });
        }

        const query = `
            INSERT INTO donations 
            (donor_id, donation_date, blood_type, location, status)
            VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
            donorId,
            donationData.donation_date,
            donationData.blood_type,
            donationData.location,
            'Pending'  // Default status
        ];

        console.log('Executing query with values:', values); // Debug log

        db.query(query, values, (error, result) => {
            if (error) {
                console.error('Error adding donation request:', error);
                return reject({ error: 'Database error: ' + error.message });
            }
            resolve(result);
        });
    });
};

// Update the route handler
const addDonationRequestHandler = async (req, res) => {
    try {
        const { donorId, donationData } = req.body;
        console.log('Received donation request in handler:', { donorId, donationData });
        
        // Validate blood type against enum values
        const validBloodTypes = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
        if (!validBloodTypes.includes(donationData.blood_type)) {
            throw new Error('Invalid blood type');
        }

        const result = await addDonationRequest(donorId, donationData);
        res.json({
            success: true,
            message: 'Donation request submitted successfully',
            donationId: result.insertId
        });
    } catch (error) {
        console.error('Error in addDonationRequest handler:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to submit donation request'
        });
    }
};

// Function to add a blood request
const addBloodRequest = (donorId, requestData) => {
    return new Promise((resolve, reject) => {
        console.log('Processing blood request:', { donorId, requestData });
        
        // Validate required fields
        if (!donorId || !requestData || !requestData.blood_type || !requestData.units || !requestData.purpose || !requestData.location) {
            console.error('Missing required fields:', { donorId, requestData });
            return reject({ error: 'Missing required fields' });
        }

        const query = `
            INSERT INTO requests 
            (donor_id, request_date, blood_type, units, purpose, location, status)
            VALUES (?, CURDATE(), ?, ?, ?, ?, 'Pending')
        `;

        const values = [
            donorId,
            requestData.blood_type,
            requestData.units,
            requestData.purpose,
            requestData.location
        ];

        db.query(query, values, (error, result) => {
            if (error) {
                console.error('Error adding blood request:', error);
                return reject({ error: 'Database error' });
            }
            resolve(result);
        });
    });
};

const addBloodRequestHandler = async (req, res) => {
    try {
        const { donorId, requestData } = req.body;
        console.log('Received blood request in handler:', { donorId, requestData });
        
        // Validate blood type against enum values
        const validBloodTypes = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
        if (!validBloodTypes.includes(requestData.blood_type)) {
            throw new Error('Invalid blood type');
        }

        const result = await addBloodRequest(donorId, requestData);
        res.json({
            success: true,
            message: 'Blood request submitted successfully',
            donationId: result.insertId
        });
    } catch (error) {
        console.error('Error in addBloodRequest handler:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to submit blood request'
        });
    }
};

// Export the controller functions wrapped in route handlers
module.exports = {
    getDonationHistory: async (req, res) => {
        try {
            const donorId = req.params.donorId;
            const results = await getDonationHistory(donorId);
            res.json(results);
        } catch (error) {
            console.error('Error in getDonationHistory handler:', error);
            res.status(500).json(error);
        }
    },

    getRequestHistory: async (req, res) => {
        try {
            const donorId = req.params.donorId;
            const results = await getRequestHistory(donorId);
            res.json(results);
        } catch (error) {
            console.error('Error in getRequestHistory handler:', error);
            res.status(500).json(error);
        }
    },

    addDonationRequest: addDonationRequestHandler,

    addBloodRequest: addBloodRequestHandler
};