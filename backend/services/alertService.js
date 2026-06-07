const Alert = require('../models/Alert');
const Threat = require('../models/Threat');
const { v4: uuidv4 } = require('uuid');

class AlertService {
  async createAlert(threatId, threatData) {
    try {
      const severity = this.calculateSeverity(threatData.severity);
      const priority = this.calculatePriority(severity);

      const alert = new Alert({
        alertId: uuidv4(),
        threatId: threatId,
        severity,
        title: threatData.title,
        message: threatData.description,
        type: 'new_threat',
        priority,
        affectedResources: threatData.affectedSystems || [],
        recommendations: this.generateRecommendations(threatData.type, severity),
      });

      await alert.save();
      return alert;
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  }

  async getActiveAlerts(limit = 50) {
    try {
      return await Alert.find({ status: 'active' })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('threatId');
    } catch (error) {
      console.error('Error getting active alerts:', error);
      throw error;
    }
  }

  async getAllAlerts(filters = {}, limit = 100) {
    try {
      const query = {};
      if (filters.severity) query.severity = filters.severity;
      if (filters.status) query.status = filters.status;
      if (filters.type) query.type = filters.type;

      return await Alert.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('threatId');
    } catch (error) {
      console.error('Error getting alerts:', error);
      throw error;
    }
  }

  async acknowledgeAlert(alertId, acknowledgedBy) {
    try {
      const alert = await Alert.findByIdAndUpdate(
        alertId,
        {
          status: 'acknowledged',
          'acknowledgedBy.name': acknowledgedBy,
          'acknowledgedBy.timestamp': new Date(),
        },
        { new: true }
      );
      return alert;
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      throw error;
    }
  }

  async resolveAlert(alertId) {
    try {
      const alert = await Alert.findByIdAndUpdate(
        alertId,
        {
          status: 'resolved',
          resolvedAt: new Date(),
        },
        { new: true }
      );
      return alert;
    } catch (error) {
      console.error('Error resolving alert:', error);
      throw error;
    }
  }

  calculateSeverity(threatSeverity) {
    if (threatSeverity >= 9) return 'critical';
    if (threatSeverity >= 7) return 'high';
    if (threatSeverity >= 5) return 'medium';
    if (threatSeverity >= 3) return 'low';
    return 'info';
  }

  calculatePriority(severity) {
    const priorityMap = {
      critical: 5,
      high: 4,
      medium: 3,
      low: 2,
      info: 1,
    };
    return priorityMap[severity] || 1;
  }

  generateRecommendations(threatType, severity) {
    const recommendations = {
      malware: [
        'Isolate affected systems immediately',
        'Run full system antivirus scan',
        'Check for lateral movement in network',
        'Review system logs for suspicious activity',
        'Consider system restore or reimaging',
      ],
      ip_reputation: [
        'Review firewall logs for connections to this IP',
        'Consider blocking IP at firewall level',
        'Monitor outbound connections more closely',
        'Check for malware on internal systems',
      ],
      vulnerability: [
        'Patch the system immediately',
        'Apply security updates from vendor',
        'Implement compensating controls',
        'Monitor for exploitation attempts',
        'Review vulnerability assessment reports',
      ],
      network_anomaly: [
        'Investigate network traffic patterns',
        'Check IDS/IPS logs',
        'Review firewall rules',
        'Check for port scanning activity',
        'Implement stricter network segmentation',
      ],
    };

    const typeRecommendations = recommendations[threatType] || [];
    
    // Add severity-based recommendations
    if (severity === 'critical' || severity === 'high') {
      typeRecommendations.unshift('Escalate to security team immediately');
      typeRecommendations.push('Brief executive management');
    }

    return typeRecommendations;
  }

  async getAlertStats() {
    try {
      const activeCount = await Alert.countDocuments({ status: 'active' });
      const acknowledgedCount = await Alert.countDocuments({ status: 'acknowledged' });
      const resolvedCount = await Alert.countDocuments({ status: 'resolved' });

      const bySeverity = await Alert.aggregate([
        {
          $group: {
            _id: '$severity',
            count: { $sum: 1 },
          },
        },
      ]);

      return {
        active: activeCount,
        acknowledged: acknowledgedCount,
        resolved: resolvedCount,
        bySeverity: bySeverity,
      };
    } catch (error) {
      console.error('Error getting alert stats:', error);
      throw error;
    }
  }
}

module.exports = new AlertService();
