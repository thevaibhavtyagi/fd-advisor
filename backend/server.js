/**
 * FD Advisor Backend Server
 * Production-Ready Express.js server with MongoDB and Gemini AI
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import apiRoutes from './routes/api.js';

// Load environment variables immediately
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 1. STRICT CORS CONFIGURATION
// ==========================================
// We explicitly allow local testing and your live Vercel domain
const allowedOrigins = [
  'http://localhost:3000',
  'https://fd-advisor.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// ==========================================
// 2. MIDDLEWARE
// ==========================================
app.use(express.json()); // Parse incoming JSON payloads

// ==========================================
// 3. ROUTES
// ==========================================
// Health check endpoint (Used by Render to verify uptime)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Mount core API routes
app.use('/api', apiRoutes);

// ==========================================
// 4. GLOBAL ERROR HANDLER
// ==========================================
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.message || err);
  
  // Safely return errors without crashing the server
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// ==========================================
// 5. DATABASE CONNECTION & SERVER START
// ==========================================
const startServer = async () => {
  try {
    // Safely grab the Mongo URI (checking both common naming conventions)
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error('[CRITICAL] MongoDB URI is missing from environment variables!');
      process.exit(1); 
    }

    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('[MongoDB] Connected successfully');

    // Start listening ONLY after the database is connected
    app.listen(PORT, () => {
      console.log(`[Server] Running on port ${PORT}`);
      console.log(`[Server] Health check: http://localhost:${PORT}/health`);
    });

  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
};

// Initialize the server
startServer();

export default app;