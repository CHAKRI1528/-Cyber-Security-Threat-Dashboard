const Threat = require('../models/Threat');
const threatMonitoringService = require('../services/threatMonitoringService');
const threatIntelligenceService = require('../services/threatIntelligenceService');

// Get all threats
exports.getAllThreats = async (req, res) => {
  try {
    const { severity, type, source, limit = 50, page = 1 } = req.query;
    const query = {};

    if (severity) {
      const severityNum = parseFloat(severity);
      query.severity = { $gte: severityNum };
    }
    if (type) query.type = type;
    if (source) query.source = source;

    const skip = (page - 1) * limit;

    const threats = await Threat.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Threat.countDocuments(query);

    res.json({
      success: true,
      data: threats,
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

// Get single threat
exports.getThreatById = async (req, res) => {
  try {
    const threat = await Threat.findById(req.params.id);

    if (!threat) {
      return res.status(404).json({
        success: false,
        error: 'Threat not found',
      });
    }

    res.json({
      success: true,
      data: threat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update threat status
exports.updateThreatStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'investigating', 'resolved', 'ignored'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status',
      });
    }

    const threat = await Threat.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!threat) {
      return res.status(404).json({
        success: false,
        error: 'Threat not found',
      });
    }

    res.json({
      success: true,
      data: threat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get threat analytics
exports.getThreatAnalytics = async (req, res) => {
  try {
    const threats = await Threat.find({});

    const analytics = {
      total: threats.length,
      byType: {},
      bySeverity: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        info: 0,
      },
      bySource: {},
      byStatus: {},
      averageSeverity: threats.length > 0 
        ? threats.reduce((sum, t) => sum + t.severity, 0) / threats.length 
        : 0,
    };

    threats.forEach(threat => {
      // By Type
      analytics.byType[threat.type] = (analytics.byType[threat.type] || 0) + 1;

      // By Severity
      if (threat.severity >= 9) analytics.bySeverity.critical++;
      else if (threat.severity >= 7) analytics.bySeverity.high++;
      else if (threat.severity >= 5) analytics.bySeverity.medium++;
      else if (threat.severity >= 3) analytics.bySeverity.low++;
      else analytics.bySeverity.info++;

      // By Source
      analytics.bySource[threat.source] = (analytics.bySource[threat.source] || 0) + 1;

      // By Status
      analytics.byStatus[threat.status] = (analytics.byStatus[threat.status] || 0) + 1;
    });

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get latest threats
exports.getLatestThreats = async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const threats = await threatMonitoringService.getLatestThreats(limit);

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

// Get threat stats
exports.getThreatStats = async (req, res) => {
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

// Check URL for threats
exports.checkURL = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required',
      });
    }

    // Check the URL using threat intelligence service
    const result = await threatIntelligenceService.checkURL(url);

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Save all URL checks (both suspicious and safe) to database
    const threatData = result.data;
    const threat = new Threat({
      threatId: threatData.threatId,
      type: 'url_check',
      source: 'url_checker',
      severity: threatData.severity,
      title: `URL Check: ${url}`,
      description: threatData.isSuspicious 
        ? `Suspicious URL detected: ${url}` 
        : `Safe URL checked: ${url}`,
      url: url,
      isSuspicious: threatData.isSuspicious,
      threats: threatData.threats,
      tags: threatData.tags,
      indicators: threatData.indicators,
      confidence: threatData.severity * 10,
      sourceData: threatData.sourceData,
      status: threatData.isSuspicious ? 'new' : 'resolved',
    });
    const savedThreat = await threat.save();

    res.json({
      success: true,
      data: result.data,
      saved: true,
      recordId: savedThreat._id,
    });
  } catch (error) {
    console.error('Error checking URL:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
