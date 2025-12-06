const express = require('express');
const router = express.Router();
const detectController = require('../controllers/detectController');

router.post('/', detectController.detectPlatform);

module.exports = router;
