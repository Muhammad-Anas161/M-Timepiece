import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

// Load environment variables
dotenv.config();

const resetAdmin = async () => {
  try {
    await connectDB();

    const adminPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(adminPassword, salt);

    // Delete existing admin
    await User.deleteOne({ username: 'admin' });
    console.log("Deleted existing admin (if any)");

    // Create new admin
    const admin = new User({
      username: 'admin',
      password: hash,
      email: 'admin@watchjunction.com',
      role: 'admin'
    });

    await admin.save();
    console.log("Admin user reset: admin / password123");
    
    process.exit(0);
  } catch (err) {
    console.error("Error resetting admin:", err);
    process.exit(1);
  }
};

resetAdmin();
