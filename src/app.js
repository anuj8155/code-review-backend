const express = require('express');
const cors = require('cors');


const airoutes = require('./routes/ai.routes');
require('dotenv').config();

const app = express();

// CORS configuration - MUST BE FIRST
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'];

  // Log CORS configuration for debugging
 

console.log('3 Starting server...');
  app.use(cors({
    origin: function (origin, callback) {
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        
        return callback(null, true);
      }
      
      if (allowedOrigins.indexOf(origin) !== -1) {
       
        callback(null, true);
      } else {
        
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
      'X-CSRF-Token'
    ],
    exposedHeaders: ['Content-Length', 'X-Requested-With'],
    maxAge: 86400, // 24 hours
    optionsSuccessStatus: 200,
    preflightContinue: false,
  }));

// Security headers




// Rate limiting to prevent abuse


// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/api', airoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: isProduction ? 'Internal Server Error' : err.message,
    error: isProduction ? {} : err.stack,
  });
});

// Handle unhandled routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
