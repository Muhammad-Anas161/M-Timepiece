import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - CORS configuration for production
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Static files for uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auto-run migrations on startup (Fix for Railway defaulting to 'node index.js')
import { execSync } from 'child_process';

try {
  console.log('Running database migrations...');
  const migrationScripts = [
    'migrate.js',
    'migrate_tracking.js',
    'migrate_loyalty.js',
    'migrate_variants.js',
    'migrate_order_variants.js'
  ];

  migrationScripts.forEach(script => {
    try {
      console.log(`Executing ${script}...`);
      // Use node to run the script in the current directory
      execSync(`node ${script}`, { stdio: 'inherit', cwd: __dirname });
    } catch (e) {
      console.error(`Failed to run ${script}:`, e.message);
      // Don't exit, try next migration (soft fail)
    }
  });
  console.log('All migrations attempted.');
} catch (error) {
  console.error('Migration runner failed:', error);
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
