const mongoose = require('mongoose');

const threatSchema = new mongoose.Schema({
  threatId: {
    type: String,
    unique: true,
    required: true,
  },
  type: {
    type: String,
    enum: ['malware', 'ip_reputation', 'vulnerability', 'network_anomaly', 'phishing', 'ransomware', 'url_check'],
    required: true,
  },
  source: {
    type: String,
    enum: ['abuseipdb', 'virustotal', 'shodan', 'misp', 'internal', 'url_checker'],
    required: true,
  },
  severity: {
    type: Number,
    min: 0,
    max: 10,
    required: true,
  },
  status: {
    type: String,
    enum: ['new', 'investigating', 'resolved', 'ignored'],
    default: 'new',
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  sourceData: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  domain: String,
  fileHash: String,
  malwareFamily: String,
  affectedSystems: [String],
  confidence: {
    type: Number,
    min: 0,
    max: 100,
  },
  tags: [String],
  indicators: {
    reputation_score: Number,
    detection_count: Number,
    last_seen: Date,
    first_seen: Date,
  },
  mitigationSteps: [String],
  references: [String],
  url: String,
  isSuspicious: Boolean,
  threats: [mongoose.Schema.Types.Mixed],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    index: { expireAfterSeconds: 2592000 }, // 30 days
  },
});

threatSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

threatSchema.index({ createdAt: -1 });
threatSchema.index({ severity: -1 });
threatSchema.index({ source: 1 });
threatSchema.index({ type: 1 });

module.exports = mongoose.model('Threat', threatSchema);
