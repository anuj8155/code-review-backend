const express = require('express');
const cors = require('cors');


const airoutes = require('./routes/ai.routes');
require('dotenv').config();

const app = express();

// Environment-based configuration
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = [
  isProduction ? 'https://code-review-frontend-tau.vercel.app' : 'http://localhost:5173',
  // Add other allowed origins as needed
];

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., server-to-server or Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Enable if your frontend sends cookies or auth headers
  })
);

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
