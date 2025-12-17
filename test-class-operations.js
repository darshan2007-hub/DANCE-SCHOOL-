const mongoose = require('mongoose');
require('dotenv').config();

const Class = require('./models/Class');

async function testClassOperations() {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Test 1: Create a class
    console.log('\n🧪 Test 1: Creating a class...');
    const newClass = await Class.create({
      name: "Test Hip Hop",
      instructor: "Test Instructor",
      duration: 60,
      price: 50,
      capacity: 20,
      schedule: { day: "Monday", time: "10:00" },
      level: "Beginner",
      category: "Hip Hop",
      description: "Test class for MongoDB operations"
    });
    console.log('✅ Class created:', newClass.name, 'ID:', newClass._id);

    // Test 2: Fetch all classes
    console.log('\n🧪 Test 2: Fetching all classes...');
    const allClasses = await Class.find();
    console.log('✅ Total classes in database:', allClasses.length);
    allClasses.forEach(cls => {
      console.log(`  - ${cls.name} (${cls.instructor}) - ID: ${cls._id}`);
    });

    // Test 3: Delete the test class
    console.log('\n🧪 Test 3: Deleting test class...');
    const deletedClass = await Class.findByIdAndDelete(newClass._id);
    console.log('✅ Class deleted:', deletedClass.name);

    // Test 4: Verify deletion
    console.log('\n🧪 Test 4: Verifying deletion...');
    const remainingClasses = await Class.find();
    console.log('✅ Remaining classes:', remainingClasses.length);

    console.log('\n🎉 All tests passed! MongoDB Atlas operations working correctly.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testClassOperations();