const alertService = require('../services/alertService');

// Get all alerts
exports.getAllAlerts = async (req, res) => {
  try {
    const { severity, status, type, limit = 50, page = 1 } = req.query;

    const filters = {};
    if (severity) filters.severity = severity;
    if (status) filters.status = status;
    if (type) filters.type = type;

    const skip = (page - 1) * limit;

    const alerts = await alertService.getAllAlerts(filters, parseInt(limit) * parseInt(page));
    const paginatedAlerts = alerts.slice(skip, skip + parseInt(limit));
    const total = alerts.length;

    res.json({
      success: true,
      data: paginatedAlerts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get active alerts
exports.getActiveAlerts = async (req, res) => {
  try {
    const alerts = await alertService.getActiveAlerts(100);

    res.json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Acknowledge alert
exports.acknowledgeAlert = async (req, res) => {
  try {
    const { acknowledgedBy } = req.body;

    if (!acknowledgedBy) {
      return res.status(400).json({
        success: false,
        error: 'acknowledgedBy is required',
      });
    }

    const alert = await alertService.acknowledgeAlert(req.params.id, acknowledgedBy);

    if (!alert) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found',
      });
    }

    res.json({
      success: true,
      data: alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Resolve alert
exports.resolveAlert = async (req, res) => {
  try {
    const alert = await alertService.resolveAlert(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found',
      });
    }

    res.json({
      success: true,
      data: alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get alert statistics
exports.getAlertStats = async (req, res) => {
  try {
    const stats = await alertService.getAlertStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
