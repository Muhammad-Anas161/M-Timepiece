import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const adminPassword = 'password123';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(adminPassword, salt);

db.serialize(() => {
  db.run("DELETE FROM users WHERE username = 'admin'", (err) => {
    if (err) console.error("Error deleting admin:", err);
    else console.log("Deleted existing admin (if any)");
    
    db.run("INSERT INTO users (username, password) VALUES (?, ?)", ['admin', hash], (err) => {
      if (err) console.error("Error creating admin:", err);
      else console.log("Admin user reset: admin / password123");
    });
  });
});
