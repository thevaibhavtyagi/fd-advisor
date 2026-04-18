/**
 * FD Advisor Backend Server
 * Express.js server with MongoDB and Gemini AI integration
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import apiRoutes from './routes/api.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Updated for production flexibility
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL // This will be your Vercel URL later
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API Routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // FIX: Check for both naming conventions
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (mongoUri) {
      await mongoose.connect(mongoUri);
      console.log('[MongoDB] Connected successfully');
    } else {
      console.warn('[MongoDB] Database URI not found in .env - check MONGODB_URI or MONGO_URI');
    }

    app.listen(PORT, () => {
      console.log(`[Server] Running on port ${PORT}`);
      console.log(`[Server] Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
};

startServer();

export default app;