const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// Get statistics
router.get('/', statsController.getStatistics);

// Force refresh statistics
router.post('/refresh', statsController.refreshStats);

// Get threat trends
router.get('/trends', statsController.getThreatTrends);

// Get dashboard overview
router.get('/dashboard/overview', statsController.getDashboardOverview);

module.exports = router;
