const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath, err);
    } else {
        console.log('Connected to SQLite database.');

        // Create Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT VIDEO,
            password TEXT,
            role TEXT
        )`, (err) => {
            if (err) console.error(err);
            else {
                // Insert default admin if not exists
                // For prototype: plain text password. In prod: hash it.
                const insert = 'INSERT INTO users (email, password, role) SELECT ?, ?, ? WHERE NOT EXISTS(SELECT 1 FROM users WHERE email = ?)';
                db.run(insert, ['admin@rds.com', 'admin123', 'admin', 'admin@rds.com']);
                db.run(insert, ['user@rds.com', 'user123', 'user', 'user@rds.com']);
                db.run(insert, ['rdsprojects@gmail.com', 'rdsprojects@123', 'admin', 'rdsprojects@gmail.com']);
            }
        });

        // Create Downloads Log Table
        db.run(`CREATE TABLE IF NOT EXISTS downloads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT,
            platform TEXT,
            quality TEXT,
            format TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

module.exports = db;
