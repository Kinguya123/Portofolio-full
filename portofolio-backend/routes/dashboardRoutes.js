'use strict';
const express = require('express');
const router = express.Router();
const { getDashboard, getSummary, getChartData } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// Semua route dashboard harus login
router.get('/', protect, getDashboard);
router.get('/summary', protect, getSummary);
router.get('/charts', protect, getChartData);

module.exports = router;