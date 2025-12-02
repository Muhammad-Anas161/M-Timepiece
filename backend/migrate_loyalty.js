import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Starting migration...');

db.serialize(() => {
  // Add email column to users
  db.run("ALTER TABLE users ADD COLUMN email TEXT UNIQUE", (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Error adding email column:', err);
    } else {
      console.log('Email column added or already exists');
    }
  });

  // Add loyalty_points column to users
  db.run("ALTER TABLE users ADD COLUMN loyalty_points INTEGER DEFAULT 0", (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Error adding loyalty_points column:', err);
    } else {
      console.log('Loyalty points column added or already exists');
    }
  });

  // Create loyalty_history table
  db.run(`CREATE TABLE IF NOT EXISTS loyalty_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    points INTEGER,
    type TEXT, -- 'earned' or 'redeemed'
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`, (err) => {
    if (err) console.error('Error creating loyalty_history table:', err);
    else console.log('Loyalty history table created');
  });
});

db.close(() => {
  console.log('Migration complete');
});
