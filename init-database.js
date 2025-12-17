const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Class = require('./models/Class');
require('dotenv').config();

const initDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/danceschool');
    console.log('Connected to MongoDB');

    // Create default admin
    const existingAdmin = await Admin.findOne({ email: 'admin@danceschool.com' });
    if (!existingAdmin) {
      await Admin.create({
        username: 'admin',
        email: 'admin@danceschool.com',
        password: 'admin123',
        role: 'super-admin'
      });
      console.log('Default admin created: username: admin, password: admin123');
    } else {
      console.log('Default admin already exists: username: admin, password: admin123');
    }

    // Create sample classes
    const existingClasses = await Class.countDocuments();
    if (existingClasses === 0) {
      const sampleClasses = [
        {
          name: 'Ballet Basics',
          description: 'Learn the fundamentals of classical ballet',
          instructor: 'Sarah Johnson',
          duration: 60,
          price: 25,
          capacity: 15,
          schedule: { day: 'Monday', time: '6:00 PM' },
          level: 'Beginner',
          category: 'Ballet'
        },
        {
          name: 'Hip Hop Groove',
          description: 'High-energy hip hop dance class',
          instructor: 'Mike Davis',
          duration: 45,
          price: 20,
          capacity: 20,
          schedule: { day: 'Wednesday', time: '7:00 PM' },
          level: 'Intermediate',
          category: 'Hip Hop'
        },
        {
          name: 'Salsa Nights',
          description: 'Learn passionate salsa dancing',
          instructor: 'Maria Rodriguez',
          duration: 90,
          price: 30,
          capacity: 12,
          schedule: { day: 'Friday', time: '8:00 PM' },
          level: 'Beginner',
          category: 'Salsa'
        }
      ];

      await Class.insertMany(sampleClasses);
      console.log('Sample classes created');
    }

    console.log('Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

initDatabase();