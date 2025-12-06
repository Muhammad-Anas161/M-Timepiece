import express from 'express';
import geoip from 'geoip-lite';

const router = express.Router();

router.get('/', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  // Handle localhost/::1
  const cleanIp = ip === '::1' ? '127.0.0.1' : ip.split(',')[0].trim();
  
  const geo = geoip.lookup(cleanIp);
  const country = geo ? geo.country : 'PK'; // Default to PK if unknown

  // Logic: If country is PK, return PKR. Else return USD (or international)
  const isPakistan = country === 'PK';
  
  res.json({
    country,
    currency: isPakistan ? 'PKR' : 'USD',
    symbol: isPakistan ? 'Rs ' : '$',
    rate: isPakistan ? 1 : 0.0036 // 1 PKR = 0.0036 USD (Approx)
  });
});

export default router;
