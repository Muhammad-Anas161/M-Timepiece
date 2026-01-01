import express from 'express';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';
import VisitorLog from '../models/VisitorLog.js';

const router = express.Router();

// Middleware to extract visitor info
const extractVisitorInfo = (req) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  // Handle localhost/::1
  const cleanIp = ip === '::1' ? '127.0.0.1' : ip.split(',')[0].trim();
  
  const geo = geoip.lookup(cleanIp);
  const ua = UAParser(req.headers['user-agent']);
  
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
router.post('/log', async (req, res) => {
  const { screen_resolution, page_url } = req.body;
  const visitor = extractVisitorInfo(req);

  try {
    const log = new VisitorLog({
      ip_address: visitor.ip,
      user_agent: req.headers['user-agent'],
      browser: visitor.browser,
      os: visitor.os,
      device_type: visitor.device,
      screen_resolution: screen_resolution || 'Unknown',
      city: visitor.city,
      country: visitor.country,
      referrer: visitor.referrer,
      page_url: page_url || visitor.referrer
    });

    await log.save();
    res.json({ message: 'Visit logged', id: log._id });
  } catch (err) {
    console.error('Error logging visitor:', err);
    res.status(500).json({ message: 'Error logging visit', error: err.message });
  }
});

// GET /api/tracking/live - Get live traffic data (Admin only)
router.get('/live', async (req, res) => {
  try {
    // Get last 50 visits
    const rows = await VisitorLog.find().sort({ visit_time: -1 }).limit(50);
    
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
  } catch (err) {
    console.error('Error fetching live traffic:', err);
    res.status(500).json({ message: 'Error fetching traffic data', error: err.message });
  }
});

export default router;
