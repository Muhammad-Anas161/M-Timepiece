import geoip from 'geoip-lite';
import UAParser from 'ua-parser-js';

console.log('Testing dependencies...');

try {
  const ip = '207.97.227.239';
  const geo = geoip.lookup(ip);
  console.log('GeoIP:', geo);

  const uaString = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
  const parser = new UAParser(uaString);
  const result = parser.getResult();
  console.log('UA Parser:', result);

  console.log('Dependencies OK');
} catch (error) {
  console.error('Error:', error);
}
