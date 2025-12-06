import express from 'express';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';
import db from '../database.js';

const router = express.Router();

// Middleware to extract visitor info
const extractVisitorInfo = (req) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  // Handle localhost/::1
  const cleanIp = ip === '::1' ? '127.0.0.1' : ip.split(',')[0].trim();
  
  const geo = geoip.lookup(cleanIp);
  const parser = new UAParser(req.headers['user-agent']);
  const ua = parser.getResult();
  
  return {
    ip: cleanIp,
    city: geo ? geo.city : 'Unknown',
    country: geo ? geo.country : 'Unknown',
    browser: `${ua.browser.name || 'Unknown'} ${ua.browser.version || ''}`,
    os: `${ua.os.name || 'Unknown'} ${ua.os.version || ''}`,
    device: ua.device.type || 'Desktop',
    referrer: req.headers.referer || 'Direct'
  };
};

// POST /api/tracking/log - Log visitor data
router.post('/log', (req, res) => {
  const { screen_resolution, page_url } = req.body;
  const visitor = extractVisitorInfo(req);

  const query = `
    INSERT INTO visitor_logs 
    (ip_address, user_agent, browser, os, device_type, screen_resolution, city, country, referrer, page_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    visitor.ip,
    req.headers['user-agent'],
    visitor.browser,
    visitor.os,
    visitor.device,
    screen_resolution || 'Unknown',
    visitor.city,
    visitor.country,
    visitor.referrer,
    page_url || visitor.referrer
  ];

  db.run(query, params, function(err) {
    if (err) {
      console.error('Error logging visitor:', err);
      return res.status(500).json({ message: 'Error logging visit' });
    }
    res.json({ message: 'Visit logged', id: this.lastID });
  });
});

// GET /api/tracking/live - Get live traffic data (Admin only)
router.get('/live', (req, res) => {
  // Get last 50 visits
  const query = `
    SELECT * FROM visitor_logs 
    ORDER BY visit_time DESC 
    LIMIT 50
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching live traffic:', err);
      return res.status(500).json({ message: 'Error fetching traffic data' });
    }
    
    // Calculate stats
    const stats = {
      total_visits: rows.length,
      active_countries: [...new Set(rows.map(r => r.country))].length,
      device_breakdown: rows.reduce((acc, curr) => {
        acc[curr.device_type] = (acc[curr.device_type] || 0) + 1;
        return acc;
      }, {})
    };

    res.json({ visits: rows, stats });
  });
});

export default router;
