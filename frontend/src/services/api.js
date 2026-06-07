import axios from 'axios';
import io from 'socket.io-client';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Socket.io connection
let socket = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });
  }
  return socket;
};

export const getSocket = () => socket;

// Threat API endpoints
export const threatService = {
  getAllThreats: (params) => api.get('/threats', { params }),
  getThreatById: (id) => api.get(`/threats/${id}`),
  updateThreatStatus: (id, status) => api.patch(`/threats/${id}/status`, { status }),
  getThreatAnalytics: () => api.get('/threats/analytics/overview'),
  getLatestThreats: (limit) => api.get('/threats/analytics/latest', { params: { limit } }),
  getThreatStats: () => api.get('/threats/analytics/stats'),
};

// Alert API endpoints
export const alertService = {
  getAllAlerts: (params) => api.get('/alerts', { params }),
  getActiveAlerts: () => api.get('/alerts/active'),
  acknowledgeAlert: (id, acknowledgedBy) =>
    api.patch(`/alerts/${id}/acknowledge`, { acknowledgedBy }),
  resolveAlert: (id) => api.patch(`/alerts/${id}/resolve`),
  getAlertStats: () => api.get('/alerts/stats'),
};

// Statistics API endpoints
export const statsService = {
  getStatistics: () => api.get('/stats'),
  getThreatTrends: (days) => api.get('/stats/trends', { params: { days } }),
  getDashboardOverview: () => api.get('/stats/dashboard/overview'),
};

// Socket event listeners
export const setupSocketListeners = (onNewThreat, onNewAlert, onStatsUpdate) => {
  const sock = connectSocket();

  if (onNewThreat) {
    sock.on('new-threat', onNewThreat);
  }

  if (onNewAlert) {
    sock.on('new-alert', onNewAlert);
  }

  if (onStatsUpdate) {
    sock.on('stats-update', onStatsUpdate);
  }

  return () => {
    if (onNewThreat) sock.off('new-threat', onNewThreat);
    if (onNewAlert) sock.off('new-alert', onNewAlert);
    if (onStatsUpdate) sock.off('stats-update', onStatsUpdate);
  };
};

export const subscribeTothreats = () => {
  const sock = connectSocket();
  sock.emit('subscribe-threats');
};

export const subscribeToAlerts = () => {
  const sock = connectSocket();
  sock.emit('subscribe-alerts');
};
