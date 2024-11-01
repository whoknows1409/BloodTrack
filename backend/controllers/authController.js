// backend/controllers/authController.js
const db = require('../config/db');

// Login function for the admin
exports.loginAdmin = (req, res) => {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
        return res.status(400).send("Email and password are required");
    }

    // Trim whitespace
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Query to fetch the admin's password by email
    const query = 'SELECT password FROM admins WHERE email = ?';

    db.query(query, [trimmedEmail], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).send("Error querying database");
        }

        if (results.length > 0) {
            // Check if the plain-text password matches
            if (results[0].password === trimmedPassword) {
                res.send("Login successful");
            } else {
                res.status(401).send("Invalid credentials");
            }
        } else {
            res.status(401).send("Admin not found");
        }
    });
};

// New donor login function
exports.loginDonor = (req, res) => {
    const { email, password } = req.body;

    // Query to fetch the donor's password by email
    const query = 'SELECT * FROM donors WHERE email = ?';

    db.query(query, [email], (error, results) => {
        if (error) {
            return res.status(500).send("Error querying database");
        }

        if (results.length > 0) {
            // Check if the plain-text password matches
            if (results[0].password === password) {
                res.json({ message: "Login successful", success: true, donorId: results[0].id });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        } else {
            res.status(401).json({ message: "Donor not found" });
        }
    });
};

exports.registerDonor = (req, res) => {
    const { email, password, full_name, gender, age, blood_group, address, contact_number } = req.body;

    // Validate input fields
    if (!email || !password || !full_name || !gender || !age || !blood_group || !address || !contact_number) {
        return res.status(400).send("All fields are required.");
    }

    // Insert donor details into the database
    const query = 'INSERT INTO donors (email, password, full_name, gender, age, blood_group, address, contact_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(query, [email, password, full_name, gender, age, blood_group, address, contact_number], (error, results) => {
        if (error) {
            // Handle unique constraint violation (duplicate email)
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).send("Email already exists.");
            }
            return res.status(500).send("Error inserting data into the database.");
        }
        res.status(201).send("Registration successful!");
    });
};

// New recipient login function
exports.loginRecipient = (req, res) => {
    const { email, password } = req.body;

    // Query to fetch the recipient's password by email
    const query = 'SELECT * FROM recipients WHERE email = ?';

    db.query(query, [email], (error, results) => {
        if (error) {
            return res.status(500).send("Error querying database");
        }

        if (results.length > 0) {
            // Check if the plain-text password matches
            if (results[0].password === password) {
                res.json({ message: "Login successful", success: true });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        } else {
            res.status(401).json({ message: "Recipient not found" });
        }
    });
};

// New recipient registration function
exports.registerRecipient = (req, res) => {
    const { email, password, full_name, gender, age, address, contact_number } = req.body;

    // Validate input fields
    if (!email || !password || !full_name || !gender || !age || !address || !contact_number) {
        return res.status(400).send("All fields are required.");
    }

    // Insert recipient details into the database
    const query = 'INSERT INTO recipients (email, password, full_name, gender, age, address, contact_number) VALUES (?, ?, ?, ?, ?, ?, ?)';

    db.query(query, [email, password, full_name, gender, age, address, contact_number], (error, results) => {
        if (error) {
            // Handle unique constraint violation (duplicate email)
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).send("Email already exists.");
            }
            return res.status(500).send("Error inserting data into the database.");
        }
        res.status(201).send("Registration successful!");
    });
};