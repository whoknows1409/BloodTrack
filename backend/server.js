// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const donorRoutes = require('./routes/donorRoutes');
const recipientRoutes = require('./routes/recipientRoutes');
const authRoutes = require('./routes/authRoutes'); // Assuming authRoutes is already defined
const adminRoutes = require('./routes/adminRoutes');
const db = require('./config/db'); // Ensure DB is connected when the server starts

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route setup
app.use('/auth', authRoutes);
app.use('/donor', donorRoutes); // Link the donor routes
app.use('/recipient', recipientRoutes);
app.use('/admin', adminRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Blood Bank Management API is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
