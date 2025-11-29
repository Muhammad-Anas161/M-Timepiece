import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const passwordToCheck = 'password123';

db.get("SELECT * FROM users WHERE username = 'admin'", (err, row) => {
  if (err) {
    console.error("Error:", err);
  } else if (!row) {
    console.log("Admin user NOT found.");
  } else {
    console.log("Admin user found:", row);
    const isValid = bcrypt.compareSync(passwordToCheck, row.password);
    console.log(`Password '${passwordToCheck}' is valid: ${isValid}`);
  }
  db.close();
});
