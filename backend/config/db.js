// backend/config/db.js
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',    // Database host
    user: 'root',         // Database user
    password: 'immOmi14', // Database password
    database: 'bloodtrackdb' // Database name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to the MySQL database');
    }
});

module.exports = db;
