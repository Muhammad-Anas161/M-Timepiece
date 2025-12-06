import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Migrating Visitor Logs Table...');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS visitor_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT,
    user_agent TEXT,
    browser TEXT,
    os TEXT,
    device_type TEXT,
    screen_resolution TEXT,
    city TEXT,
    country TEXT,
    referrer TEXT,
    page_url TEXT,
    visit_time DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error creating visitor_logs table:', err.message);
    } else {
      console.log('visitor_logs table created successfully');
    }
  });
});

db.close(() => {
  console.log('Migration complete');
});
