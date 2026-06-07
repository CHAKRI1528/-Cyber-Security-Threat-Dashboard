const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

// Get all alerts
router.get('/', alertController.getAllAlerts);

// Get active alerts
router.get('/active', alertController.getActiveAlerts);

// Get alert statistics
router.get('/stats', alertController.getAlertStats);

// Acknowledge alert
router.patch('/:id/acknowledge', alertController.acknowledgeAlert);

// Resolve alert
router.patch('/:id/resolve', alertController.resolveAlert);

module.exports = router;
