import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Applying DB fix...');

db.serialize(() => {
  // Try adding email without UNIQUE constraint first to be safe
  db.run("ALTER TABLE users ADD COLUMN email TEXT", (err) => {
    if (err) {
      console.error('Error adding email column:', err.message);
    } else {
      console.log('Email column added successfully');
    }
  });
});

db.close(() => {
  console.log('Fix complete');
});
