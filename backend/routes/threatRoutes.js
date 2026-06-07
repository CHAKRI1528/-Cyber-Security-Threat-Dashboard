const express = require('express');
const router = express.Router();
const threatController = require('../controllers/threatController');

// Get all threats
router.get('/', threatController.getAllThreats);

// Get threat analytics
router.get('/analytics/overview', threatController.getThreatAnalytics);

// Get latest threats
router.get('/analytics/latest', threatController.getLatestThreats);

// Get threat statistics
router.get('/analytics/stats', threatController.getThreatStats);

// Check URL for threats
router.post('/check-url', threatController.checkURL);

// Get single threat
router.get('/:id', threatController.getThreatById);

// Update threat status
router.patch('/:id/status', threatController.updateThreatStatus);

module.exports = router;
