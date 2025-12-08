import db from './database.js';

// Serial execution to ensure order
db.serialize(() => {
  // 1. Add role column if it doesn't exist
  db.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'", (err) => {
    if (err) {
      if (err.message.includes('duplicate column name')) {
        console.log("Column 'role' already exists.");
      } else {
        console.error("Error adding column:", err);
        return;
      }
    } else {
      console.log("Added 'role' column to users table.");
    }

    // 2. Set admin role for 'admin' user
    db.run("UPDATE users SET role = 'admin' WHERE username = 'admin'", function(err) {
      if (err) {
        console.error("Error updating admin role:", err);
      } else {
        console.log(`Updated admin role. Rows affected: ${this.changes}`);
      }

       // 3. Verify
      db.get("SELECT id, username, role FROM users WHERE username = 'admin'", (err, row) => {
        if(err) console.error(err);
        else console.log("Verification - Admin User:", row);
      });
    });
  });
});
