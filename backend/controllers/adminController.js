// controllers/adminController.js
const db = require('../config/db');

const adminController = {
    getDashboardStats: (req, res) => {
        const queries = [
            'SELECT blood_type, units FROM blood_stock',
            'SELECT COUNT(*) as count FROM donors',
            'SELECT COUNT(*) as count FROM recipients',
            `SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as approved
            FROM requests`
        ];

        Promise.all(queries.map(query => new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        })))
        .then(([bloodStock, donorCount, recipientCount, requests]) => {
            res.json({
                bloodStock,
                donorCount: donorCount[0].count,
                recipientCount: recipientCount[0].count,
                requests: {
                    total: requests[0].total,
                    approved: requests[0].approved
                }
            });
        })
        .catch(error => {
            res.status(500).json({ message: 'Error fetching dashboard stats', error });
        });
    },

    getDonors: (req, res) => {
        db.query(`
            SELECT id, full_name, gender, age, blood_group, address, contact_number, email 
            FROM donors
            ORDER BY id`, 
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Error fetching donors', error: err });
            res.json(results);
        });
    },

    getRecipients: (req, res) => {
        db.query(`
            SELECT id, full_name, gender, age, address, contact_number, email 
            FROM recipients
            ORDER BY id`,
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Error fetching recipients', error: err });
            res.json(results);
        });
    },

    getDonationRequests: (req, res) => {
        console.log('Fetching donation requests...');
        db.query(`
            SELECT 
                d.donation_id, 
                d.donor_id,
                dr.full_name, 
                d.blood_type,
                dr.address,
                d.status, 
                d.donation_date, 
                d.comments
            FROM donations d
            JOIN donors dr ON d.donor_id = dr.id
            WHERE d.status = 'Pending'
            ORDER BY d.donation_date DESC
        `, (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Error fetching donation requests', error: err });
            }
            console.log('Donation requests fetched successfully');
            res.json(results);
        });
    },

    approveDonation: (req, res) => {
        const { id } = req.params;
        db.beginTransaction(err => {
            if (err) return res.status(500).json({ message: 'Transaction error', error: err });

            db.query(
                'UPDATE donations SET status = "Approved", response_date = CURDATE() WHERE donation_id = ?',
                [id],
                (err, result) => {
                    if (err) {
                        db.rollback(() => {
                            res.status(500).json({ message: 'Error approving donation', error: err });
                        });
                        return;
                    }

                    db.query(
                        'SELECT blood_type FROM donations WHERE donation_id = ?',
                        [id],
                        (err, results) => {
                            if (err) {
                                db.rollback(() => {
                                    res.status(500).json({ message: 'Error fetching donation details', error: err });
                                });
                                return;
                            }

                            const blood_type = results[0].blood_type;
                            db.query(
                                'UPDATE blood_stock SET units = units + 1 WHERE blood_type = ?',
                                [blood_type],
                                (err, result) => {
                                    if (err) {
                                        db.rollback(() => {
                                            res.status(500).json({ message: 'Error updating blood stock', error: err });
                                        });
                                        return;
                                    }

                                    db.commit(err => {
                                        if (err) {
                                            db.rollback(() => {
                                                res.status(500).json({ message: 'Error committing transaction', error: err });
                                            });
                                            return;
                                        }
                                        res.json({ message: 'Donation approved successfully' });
                                    });
                                }
                            );
                        }
                    );
                }
            );
        });
    },

    rejectDonation: (req, res) => {
        const { id } = req.params;
        const { comments } = req.body;

        db.query(
            'UPDATE donations SET status = "Rejected", response_date = CURDATE(), comments = ? WHERE donation_id = ?',
            [comments, id],
            (err, result) => {
                if (err) return res.status(500).json({ message: 'Error rejecting donation', error: err });
                res.json({ message: 'Donation rejected successfully' });
            }
        );
    },

    // Blood Requests Management
getBloodRequests: (req, res) => {
    const query = `
        SELECT 
            r.request_id,
            r.recipient_id,
            rr.full_name,
            r.blood_type,
            r.units,
            r.status,
            DATE_FORMAT(r.request_date, '%Y-%m-%d') as request_date,
            r.purpose,
            r.comments
        FROM requests r
        LEFT JOIN recipients rr ON r.recipient_id = rr.id
        ORDER BY r.request_date DESC`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Error fetching blood requests'
            });
        }

        return res.status(200).json({
            success: true,
            data: results || []
        });
    });
},

approveBloodRequest: (req, res) => {
    const { id } = req.params;
    
    db.beginTransaction(err => {
        if (err) return res.status(500).json({ 
            success: false, 
            message: 'Transaction error' 
        });

        db.query(
            'UPDATE requests SET status = "Approved", response_date = CURDATE() WHERE request_id = ?',
            [id],
            (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ 
                            success: false, 
                            message: 'Error approving blood request' 
                        });
                    });
                }

                db.query(
                    'SELECT blood_type, units FROM requests WHERE request_id = ?',
                    [id],
                    (err, results) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ 
                                    success: false, 
                                    message: 'Error fetching blood request details' 
                                });
                            });
                        }

                        const { blood_type, units } = results[0];
                        db.query(
                            'UPDATE blood_stock SET units = units - ? WHERE blood_type = ?',
                            [units, blood_type],
                            (err, result) => {
                                if (err) {
                                    return db.rollback(() => {
                                        res.status(500).json({ 
                                            success: false, 
                                            message: 'Error updating blood stock' 
                                        });
                                    });
                                }

                                db.commit(err => {
                                    if (err) {
                                        return db.rollback(() => {
                                            res.status(500).json({ 
                                                success: false, 
                                                message: 'Error committing transaction' 
                                            });
                                        });
                                    }
                                    res.json({ 
                                        success: true, 
                                        message: 'Blood request approved successfully' 
                                    });
                                });
                            }
                        );
                    }
                );
            }
        );
    });
},

rejectBloodRequest: (req, res) => {
    const { id } = req.params;
    const { comments } = req.body;

    db.query(
        'UPDATE requests SET status = "Rejected", response_date = CURDATE(), comments = ? WHERE request_id = ?',
        [comments || 'Request rejected by admin', id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error rejecting blood request' 
                });
            }
            res.json({ 
                success: true, 
                message: 'Blood request rejected successfully' 
            });
        }
    );
},

  // Request History
// Request History
getRequestHistory: (req, res) => {
    const query = `
        SELECT 
            'Donation' as type,
            d.donation_id as id,
            dr.full_name,
            d.blood_type,
            1 as units,
            d.status,
            DATE_FORMAT(d.donation_date, '%Y-%m-%d') as date,
            d.comments
        FROM donations d
        LEFT JOIN donors dr ON d.donor_id = dr.id
        
        UNION ALL
        
        SELECT 
            'Request' as type,
            r.request_id as id,
            rr.full_name,
            r.blood_type,
            r.units,
            r.status,
            DATE_FORMAT(r.request_date, '%Y-%m-%d') as date,
            r.comments
        FROM requests r
        LEFT JOIN recipients rr ON r.recipient_id = rr.id
        
        ORDER BY date DESC`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Error fetching request history',
                error: err
            });
        }

        return res.status(200).json({
            success: true,
            data: results || []
        });
    });
},

    getBloodStock: (req, res) => {
        db.query('SELECT blood_type, units FROM blood_stock', (err, results) => {
            if (err) {
                return res.status(500).json({ 
                    message: 'Error fetching blood stock', 
                    error: err 
                });
            }
            res.json(results);
        });
    },

    updateBloodStock: (req, res) => {
        const { blood_type, units } = req.body;
        
        db.query(
            'UPDATE blood_stock SET units = ? WHERE blood_type = ?',
            [units, blood_type],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ 
                        message: 'Error updating blood stock', 
                        error: err 
                    });
                }
                res.json({ 
                    message: 'Blood stock updated successfully', 
                    result 
                });
            }
        );
    }
};

module.exports = adminController;