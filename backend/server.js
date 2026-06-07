const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const threatRoutes = require('./routes/threatRoutes');
const alertRoutes = require('./routes/alertRoutes');
const statsRoutes = require('./routes/statsRoutes');
const threatMonitoringService = require('./services/threatMonitoringService');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cyber-threat-monitoring')
  .then(async () => {
    console.log('✓ MongoDB connected');
    
    // Start threat monitoring after DB connection
    threatMonitoringService.startMonitoring(io);
  })
  .catch(err => console.error('✗ MongoDB connection error:', err));

// Routes
app.use('/api/threats', threatRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/stats', statsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Socket.io events
io.on('connection', (socket) => {
  console.log(`✓ New client connected: ${socket.id}`);

  socket.on('subscribe-threats', () => {
    socket.join('threats-channel');
    console.log(`Client ${socket.id} subscribed to threats`);
  });

  socket.on('subscribe-alerts', () => {
    socket.join('alerts-channel');
    console.log(`Client ${socket.id} subscribed to alerts`);
  });

  socket.on('disconnect', () => {
    console.log(`✗ Client disconnected: ${socket.id}`);
  });
});

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Cyber Threat Monitoring Server running on port ${PORT}`);
  console.log(`📊 Dashboard: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = { app, server, io };
