const cron = require('node-cron');
const Threat = require('../models/Threat');
const ThreatStats = require('../models/ThreatStats');
const threatIntelligenceService = require('./threatIntelligenceService');
const alertService = require('./alertService');
const { v4: uuidv4 } = require('uuid');

class ThreatMonitoringService {
  constructor() {
    this.isMonitoring = false;
    this.checkInterval = process.env.THREAT_CHECK_INTERVAL || 300000; // 5 minutes
  }

  startMonitoring(io) {
    if (this.isMonitoring) {
      console.log('Monitoring already running');
      return;
    }

    this.isMonitoring = true;
    this.io = io;
    console.log('🔍 Starting threat monitoring...');

    // Initialize test URLs on first start (async without blocking)
    this.initializeTestURLs().then(() => {
      // Update statistics after URLs are loaded
      this.updateStatistics();
    });

    // Schedule periodic threat checks
    this.cronJob = cron.schedule('*/5 * * * *', async () => {
      await this.runThreatCheck();
    });

    // Run initial check
    this.runThreatCheck();

    // Update statistics every 10 minutes
    this.statsCronJob = cron.schedule('*/10 * * * *', async () => {
      await this.updateStatistics();
    });
  }

  stopMonitoring() {
    if (this.cronJob) {
      this.cronJob.stop();
    }
    if (this.statsCronJob) {
      this.statsCronJob.stop();
    }
    this.isMonitoring = false;
    console.log('⏹ Threat monitoring stopped');
  }

  async runThreatCheck() {
    try {
      console.log('🔄 Running threat check...');
      
      // Generate synthetic threats for demo
      const threats = await threatIntelligenceService.generateSyntheticThreats();

      for (const threatData of threats) {
        const existingThreat = await Threat.findOne({
          ipAddress: threatData.ipAddress || threatData.fileHash,
          type: threatData.type,
        });

        let threat;
        if (existingThreat) {
          // Update existing threat
          Object.assign(existingThreat, threatData);
          threat = await existingThreat.save();
        } else {
          // Create new threat
          threat = new Threat(threatData);
          threat.threatId = threatData.threatId;
          await threat.save();

          // Create alert for new threat
          if (threatData.severity >= (process.env.ALERT_THRESHOLD || 7.5)) {
            const alert = await alertService.createAlert(threat._id, threatData);
            
            // Emit alert via WebSocket
            if (this.io) {
              this.io.to('alerts-channel').emit('new-alert', {
                alert: alert.toObject(),
                threat: threat.toObject(),
              });
            }
          }

          // Emit new threat via WebSocket
          if (this.io) {
            this.io.to('threats-channel').emit('new-threat', {
              threat: threat.toObject(),
              timestamp: new Date().toISOString(),
            });
          }
        }
      }

      console.log(`✓ Threat check complete - ${threats.length} threats processed`);
    } catch (error) {
      console.error('Error in threat check:', error);
    }
  }

  async updateStatistics() {
    try {
      const threats = await Threat.find({});
      const alerts = await Threat.find({});

      const threatsByType = {
        malware: threats.filter(t => t.type === 'malware').length,
        ip_reputation: threats.filter(t => t.type === 'ip_reputation').length,
        vulnerability: threats.filter(t => t.type === 'vulnerability').length,
        network_anomaly: threats.filter(t => t.type === 'network_anomaly').length,
        phishing: threats.filter(t => t.type === 'phishing').length,
        ransomware: threats.filter(t => t.type === 'ransomware').length,
        url_check: threats.filter(t => t.type === 'url_check').length,
      };

      const threatsBySeverity = {
        critical: threats.filter(t => t.severity >= 9).length,
        high: threats.filter(t => t.severity >= 7 && t.severity < 9).length,
        medium: threats.filter(t => t.severity >= 5 && t.severity < 7).length,
        low: threats.filter(t => t.severity >= 3 && t.severity < 5).length,
        info: threats.filter(t => t.severity < 3).length,
      };

      const threatsBySource = {
        abuseipdb: threats.filter(t => t.source === 'abuseipdb').length,
        virustotal: threats.filter(t => t.source === 'virustotal').length,
        shodan: threats.filter(t => t.source === 'shodan').length,
        misp: threats.filter(t => t.source === 'misp').length,
        internal: threats.filter(t => t.source === 'internal').length,
        url_checker: threats.filter(t => t.source === 'url_checker').length,
      };

      // Calculate total active threats (excluding resolved)
      const activeThreats = threats.filter(t => t.status !== 'resolved').length;
      const resolvedThreats = threats.filter(t => t.status === 'resolved').length;

      const stats = new ThreatStats({
        totalThreats: threats.length,
        activeThreats: activeThreats,
        resolvedThreats: resolvedThreats,
        threatsByType,
        threatsBySeverity,
        threatsBySource,
        activeAlerts: alerts.filter(a => a.status === 'active').length,
        resolvedAlerts: alerts.filter(a => a.status === 'resolved').length,
        averageSeverity: threats.length > 0 
          ? threats.reduce((sum, t) => sum + t.severity, 0) / threats.length 
          : 0,
      });

      await stats.save();

      // Emit stats update via WebSocket
      if (this.io) {
        this.io.to('threats-channel').emit('stats-update', stats.toObject());
      }

      console.log('📊 Statistics updated');
    } catch (error) {
      console.error('Error updating statistics:', error);
    }
  }

  async getLatestThreats(limit = 20) {
    try {
      return await Threat.find({})
        .sort({ createdAt: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error getting latest threats:', error);
      throw error;
    }
  }

  async getThreatBySeverity() {
    try {
      return await Threat.aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            avgSeverity: { $avg: '$severity' },
          },
        },
        { $sort: { avgSeverity: -1 } },
      ]);
    } catch (error) {
      console.error('Error getting threats by severity:', error);
      throw error;
    }
  }

  async initializeTestURLs() {
    try {
      console.log('📝 Initializing test URLs...');

      // Load suspicious URLs from .env
      const suspiciousURLs = (process.env.SUSPICIOUS_URLS || '').split(',').filter(url => url.trim());
      
      // Load safe URLs from .env
      const safeURLs = (process.env.SAFE_URLS || '').split(',').filter(url => url.trim());

      console.log(`Found ${suspiciousURLs.length} suspicious URLs and ${safeURLs.length} safe URLs`);

      let addedCount = 0;

      // Add suspicious URLs as active threats
      for (const url of suspiciousURLs) {
        const urlTrimmed = url.trim();
        const existingThreat = await Threat.findOne({ url: urlTrimmed });

        if (!existingThreat) {
          const threat = new Threat({
            threatId: uuidv4(),
            type: 'url_check',
            source: 'url_checker',
            severity: Math.floor(Math.random() * (9.5 - 6)) + 6, // Random 6-9.5 for suspicious
            title: `Test Threat: ${urlTrimmed}`,
            description: `Test suspicious URL: ${urlTrimmed}`,
            url: urlTrimmed,
            isSuspicious: true,
            tags: ['test', 'suspicious', 'malicious'],
            confidence: 85,
            status: 'new',
          });
          await threat.save();
          console.log(`✓ Added suspicious URL: ${urlTrimmed}`);
          addedCount++;
        } else {
          console.log(`⚠ Suspicious URL already exists: ${urlTrimmed}`);
        }
      }

      // Add safe URLs as resolved threats
      for (const url of safeURLs) {
        const urlTrimmed = url.trim();
        const existingThreat = await Threat.findOne({ url: urlTrimmed });

        if (!existingThreat) {
          const threat = new Threat({
            threatId: uuidv4(),
            type: 'url_check',
            source: 'url_checker',
            severity: Math.floor(Math.random() * (2)), // Random 0-2 for safe
            title: `Test Safe URL: ${urlTrimmed}`,
            description: `Test safe URL: ${urlTrimmed}`,
            url: urlTrimmed,
            isSuspicious: false,
            tags: ['test', 'safe', 'verified'],
            confidence: 95,
            status: 'resolved',
          });
          await threat.save();
          console.log(`✓ Added safe URL: ${urlTrimmed}`);
          addedCount++;
        } else {
          console.log(`⚠ Safe URL already exists: ${urlTrimmed}`);
        }
      }

      // Get total threats count
      const totalThreats = await Threat.countDocuments({});
      console.log(`📊 Total threats in database: ${totalThreats}`);

      // Update statistics
      await this.updateStatistics();
      console.log(`✓ Test URLs initialized successfully - Added ${addedCount} new URLs`);
    } catch (error) {
      console.error('Error initializing test URLs:', error);
    }
  }

  async getThreatStats() {
    try {
      const recent = await ThreatStats.findOne({}).sort({ timestamp: -1 });
      return recent || await this.updateStatistics();
    } catch (error) {
      console.error('Error getting threat stats:', error);
      throw error;
    }
  }
}

module.exports = new ThreatMonitoringService();
