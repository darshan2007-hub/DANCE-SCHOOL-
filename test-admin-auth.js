const mongoose = require('mongoose');
require('dotenv').config();

const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function testAdminAuth() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Check if admin exists
    let admin = await Admin.findOne({ username: 'admin' });
    
    if (!admin) {
      console.log('🔧 Creating default admin...');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      try {
        admin = await Admin.create({
          username: 'admin',
          email: 'admin@danceschool.com',
          password: hashedPassword
        });
        console.log('✅ Admin created:', admin.username);
      } catch (error) {
        if (error.code === 11000) {
          admin = await Admin.findOne({ email: 'admin@danceschool.com' });
          console.log('✅ Admin already exists:', admin.username);
        } else {
          throw error;
        }
      }
    } else {
      console.log('✅ Admin exists:', admin.username);
    }

    // Generate token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '30d' }
    );

    console.log('🔑 Admin Token:', token);
    console.log('📋 Use this token in localStorage as "adminToken"');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testAdminAuth();