// recipientController.js
const db = require('../config/db');

// Function to get request history for a recipient
const getRequestHistory = (recipientId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT request_date, blood_type, units, purpose, location, status, response_date, comments
            FROM requests
            WHERE recipient_id = ?
            ORDER BY request_date DESC
        `;
        
        db.query(query, [recipientId], (error, results) => {
            if (error) {
                console.error('Error fetching request history:', error);
                return reject({ error: 'Database error' });
            }
            resolve(results);
        });
    });
};

// Function to add a blood request
const addBloodRequest = (recipientId, requestData) => {
    return new Promise((resolve, reject) => {
        console.log('Processing blood request:', { recipientId, requestData });
        
        // Validate required fields
        if (!recipientId || !requestData || !requestData.blood_type || !requestData.units || !requestData.purpose || !requestData.location) {
            console.error('Missing required fields:', { recipientId, requestData });
            return reject({ error: 'Missing required fields' });
        }

        const query = `
            INSERT INTO requests 
            (recipient_id, request_date, blood_type, units, purpose, location, status)
            VALUES (?, CURDATE(), ?, ?, ?,  ?, 'Pending')
        `;

        const values = [
            recipientId,
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
        const { recipientId, requestData } = req.body;
        console.log('Received blood request in handler:', { recipientId, requestData });
        
        // Validate blood type against allowed values
        const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        if (!validBloodTypes.includes(requestData.blood_type)) {
            throw new Error('Invalid blood type');
        }

        const result = await addBloodRequest(recipientId, requestData);
        res.json({
            success: true,
            message: 'Blood request submitted successfully',
            requestId: result.insertId
        });
    } catch (error) {
        console.error('Error in addBloodRequest handler:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to submit blood request'
        });
    }
};

// Function to get request counts grouped by status for a recipient
const getRequestCounts = async (req, res) => {
    const recipientId = req.params.recipientId;
    try {
        const query = `
            SELECT 
                COUNT(*) AS total, 
                SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) AS approved, 
                SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pending, 
                SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) AS rejected 
            FROM requests 
            WHERE recipient_id = ?
        `;
        
        db.query(query, [recipientId], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            res.json(results[0]); // Send counts as JSON response
        });
    } catch (error) {
        console.error('Error fetching request counts:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getRequestHistory: async (req, res) => {
        try {
            const recipientId = req.params.recipientId;
            const results = await getRequestHistory(recipientId);
            res.json(results);
        } catch (error) {
            console.error('Error in getRequestHistory handler:', error);
            res.status(500).json(error);
        }
    },

    addBloodRequest: addBloodRequestHandler,
    getRequestCounts
};
