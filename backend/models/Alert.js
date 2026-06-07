const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  alertId: {
    type: String,
    unique: true,
    required: true,
  },
  threatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Threat',
    required: true,
  },
  severity: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low', 'info'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: String,
  type: {
    type: String,
    enum: ['threshold_exceeded', 'new_threat', 'pattern_detected', 'system_alert'],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'acknowledged', 'resolved'],
    default: 'active',
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
  },
  affectedResources: [String],
  recommendations: [String],
  acknowledgedBy: {
    name: String,
    timestamp: Date,
  },
  resolvedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
    index: -1,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

alertSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

alertSchema.index({ createdAt: -1 });
alertSchema.index({ severity: 1 });
alertSchema.index({ status: 1 });

module.exports = mongoose.model('Alert', alertSchema);
