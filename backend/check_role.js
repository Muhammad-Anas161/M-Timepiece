import db from './database.js';

db.get("SELECT id, username, email, role FROM users WHERE username = 'admin'", (err, row) => {
  if (err) {
    console.error("Error fetching user:", err);
    return;
  }
  if (!row) {
    console.log("User 'admin' not found.");
  } else {
    console.log("User details:", row);
  }
});
