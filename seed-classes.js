const mongoose = require('mongoose');
const Class = require('./models/Class');
require('dotenv').config();

const sampleClasses = [
  {
    name: "Hip Hop Fundamentals",
    description: "Learn the basics of hip hop dance with high-energy moves and urban choreography.",
    instructor: "Marcus Johnson",
    duration: 60,
    price: 25,
    capacity: 20,
    schedule: {
      day: "Monday",
      time: "6:00 PM"
    },
    level: "Beginner",
    category: "Hip Hop",
    image: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=400"
  },
  {
    name: "Classical Ballet",
    description: "Traditional ballet training focusing on technique, grace, and flexibility.",
    instructor: "Sarah Martinez",
    duration: 75,
    price: 30,
    capacity: 15,
    schedule: {
      day: "Tuesday",
      time: "10:00 AM"
    },
    level: "Beginner",
    category: "Ballet",
    image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400"
  },
  {
    name: "Contemporary Expression",
    description: "Expressive movement blending multiple dance techniques with emotional storytelling.",
    instructor: "David Chen",
    duration: 75,
    price: 32,
    capacity: 18,
    schedule: {
      day: "Wednesday",
      time: "7:00 PM"
    },
    level: "Intermediate",
    category: "Contemporary",
    image: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=400"
  }
];

async function seedClasses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await Class.deleteMany({});
    console.log('Cleared existing classes');
    
    const classes = await Class.insertMany(sampleClasses);
    console.log(`Created ${classes.length} sample classes`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding classes:', error);
    process.exit(1);
  }
}

seedClasses();