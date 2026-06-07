const threatMonitoringService = require('../services/threatMonitoringService');

// Get statistics
exports.getStatistics = async (req, res) => {
  try {
    const stats = await threatMonitoringService.getThreatStats();

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

// Force refresh statistics
exports.refreshStats = async (req, res) => {
  try {
    console.log('🔄 Manual stats refresh triggered');
    await threatMonitoringService.updateStatistics();
    const stats = await threatMonitoringService.getThreatStats();

    res.json({
      success: true,
      message: 'Statistics refreshed successfully',
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get threat trends
exports.getThreatTrends = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const threats = await threatMonitoringService.getThreatBySeverity();

    res.json({
      success: true,
      data: threats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get dashboard overview
exports.getDashboardOverview = async (req, res) => {
  try {
    const stats = await threatMonitoringService.getThreatStats();
    const trends = await threatMonitoringService.getThreatBySeverity();

    const overview = {
      summary: {
        totalThreats: stats.totalThreats || 0,
        activeThreats: stats.activeThreats || 0,
        resolvedThreats: stats.resolvedThreats || 0,
        activeAlerts: stats.activeAlerts || 0,
        resolvedAlerts: stats.resolvedAlerts || 0,
        averageSeverity: (stats.averageSeverity || 0).toFixed(2),
      },
      threatDistribution: {
        byType: stats.threatsByType || {},
        bySeverity: stats.threatsBySeverity || {},
        bySource: stats.threatsBySource || {},
      },
      trends,
      lastUpdated: stats.timestamp || new Date(),
    };

    res.json({
      success: true,
      data: overview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
