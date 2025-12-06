require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Import routes
const detectRoutes = require('./routes/detect');
const downloadRoutes = require('./routes/download');
const adminRoutes = require('./routes/admin');

app.use('/api/detect', detectRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('RDS Video Downloader Backend is running');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
