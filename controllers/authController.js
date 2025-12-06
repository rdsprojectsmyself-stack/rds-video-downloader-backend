const db = require('../database/db');

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!row) return res.status(401).json({ error: 'Invalid credentials' });

        // Return simple user object (in prod use JWT)
        res.json({
            user: {
                email: row.email,
                role: row.role
            }
        });
    });
};

exports.register = (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (row) return res.status(400).json({ error: 'User already exists' });

        // Insert new user
        db.run('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, password, 'user'], function (err) {
            if (err) return res.status(500).json({ error: 'Failed to register user' });
            res.status(201).json({ message: 'Registration successful' });
        });
    });
};

exports.getStats = (req, res) => {
    // 1. Total Downloads
    // 2. Platform Breakdown
    // 3. Recent Activity

    const stats = {};

    db.get('SELECT count(*) as count FROM downloads', [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.totalDownloads = row.count;

        db.all('SELECT platform, count(*) as count FROM downloads GROUP BY platform', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            stats.byPlatform = rows;

            db.all('SELECT * FROM downloads ORDER BY timestamp DESC LIMIT 10', [], (err, rows) => {
                if (err) return res.status(500).json({ error: err.message });
                stats.recent = rows;

                res.json(stats);
            });
        });
    });
};
