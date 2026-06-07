const mongoose = require('mongoose');

const threatStatsSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  totalThreats: {
    type: Number,
    default: 0,
  },
  activeThreats: {
    type: Number,
    default: 0,
  },
  resolvedThreats: {
    type: Number,
    default: 0,
  },
  threatsByType: {
    malware: { type: Number, default: 0 },
    ip_reputation: { type: Number, default: 0 },
    vulnerability: { type: Number, default: 0 },
    network_anomaly: { type: Number, default: 0 },
    phishing: { type: Number, default: 0 },
    ransomware: { type: Number, default: 0 },
    url_check: { type: Number, default: 0 },
  },
  threatsBySeverity: {
    critical: { type: Number, default: 0 },
    high: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    low: { type: Number, default: 0 },
    info: { type: Number, default: 0 },
  },
  threatsBySource: {
    abuseipdb: { type: Number, default: 0 },
    virustotal: { type: Number, default: 0 },
    shodan: { type: Number, default: 0 },
    misp: { type: Number, default: 0 },
    internal: { type: Number, default: 0 },
    url_checker: { type: Number, default: 0 },
  },
  activeAlerts: {
    type: Number,
    default: 0,
  },
  resolvedAlerts: {
    type: Number,
    default: 0,
  },
  averageSeverity: {
    type: Number,
    default: 0,
  },
});

threatStatsSchema.index({ timestamp: -1 });
threatStatsSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

module.exports = mongoose.model('ThreatStats', threatStatsSchema);
