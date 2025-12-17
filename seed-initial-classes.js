const mongoose = require('mongoose');
require('dotenv').config();

const Class = require('./models/Class');

const initialClasses = [
  {
    name: "Hip Hop",
    instructor: "John Doe",
    duration: 60,
    price: 50,
    capacity: 20,
    schedule: { day: "Monday", time: "10:00" },
    level: "Beginner",
    category: "Hip Hop",
    description: "High-energy moves, freestyle, popping & locking",
    image: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=500"
  },
  {
    name: "Ballet",
    instructor: "Jane Smith",
    duration: 60,
    price: 60,
    capacity: 15,
    schedule: { day: "Tuesday", time: "14:00" },
    level: "Intermediate",
    category: "Ballet",
    description: "Classical technique, grace & flexibility",
    image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=500"
  },
  {
    name: "Salsa",
    instructor: "Carlos Rodriguez",
    duration: 60,
    price: 45,
    capacity: 25,
    schedule: { day: "Wednesday", time: "18:00" },
    level: "Beginner",
    category: "Salsa",
    description: "Latin rhythms, partner work & body movement",
    image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=500"
  },
  {
    name: "Contemporary",
    instructor: "Emily Johnson",
    duration: 60,
    price: 55,
    capacity: 12,
    schedule: { day: "Thursday", time: "16:00" },
    level: "Advanced",
    category: "Contemporary",
    description: "Expressive movement & creative choreography",
    image: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=500"
  }
];

async function seedClasses() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/danceschool');
    console.log('✅ Connected to MongoDB');

    // Clear existing classes
    await Class.deleteMany({});
    console.log('🗑️ Cleared existing classes');

    // Insert initial classes
    const createdClasses = await Class.insertMany(initialClasses);
    console.log(`✅ Created ${createdClasses.length} initial classes:`);
    
    createdClasses.forEach(cls => {
      console.log(`  - ${cls.name} (${cls.category}) - ${cls.instructor}`);
    });

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedClasses();