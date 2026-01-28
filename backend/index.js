import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import compression from 'compression';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js'; 
import newsletterRoutes from './routes/newsletter.js';
import reviewsRoutes from './routes/reviews.js';
import analyticsRoutes from './routes/analytics.js';
import couponsRoutes from './routes/coupons.js';
import loyaltyRoutes from './routes/loyalty.js';
import trackingRoutes from './routes/tracking.js';
import locationRoutes from './routes/location.js';
import chatRoutes from './routes/chat.js';

import connectDB from './config/db.js';

// Connect to Database
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy is required for Railway/Vercel to correctly identify HTTPS protocol
app.set('trust proxy', 1);

// Middleware - CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://m-timepiece.vercel.app',
  'https://watch-junction.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // Cache preflight response for 24 hours
}));


app.use(express.json());
app.use(compression());

// Static files for uploads
// Static files for uploads
// Check if we are using the volume path (Railway)
const isRailwayVolume = process.env.DB_FILE_PATH && process.env.DB_FILE_PATH.includes('/app/data');
const uploadsDir = isRailwayVolume 
  ? path.join('/app/data', 'uploads') 
  : process.env.UPLOADS_DIR || path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir, {
  maxAge: '7d', // Cache for 7 days
  immutable: true // File content won't change
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  
  // Ensure CORS headers are present even on errors
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    message: err.message
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
