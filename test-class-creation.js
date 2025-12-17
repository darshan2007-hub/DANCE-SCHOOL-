const fetch = require('node-fetch');

async function testClassCreation() {
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5M2MyZWZmNGYxY2JjNzAxYzdmNjNmMyIsImlhdCI6MTc2NTk1MjU4NSwiZXhwIjoxNzY4NTQ0NTg1fQ.bTRwAIxZ16_B3M4mj0HcVEOmUyX0fCjS1Ft2L7-mPAc';
    
    const classData = {
      name: 'Test API Class',
      instructor: 'Test Instructor',
      duration: 60,
      price: 25,
      capacity: 20,
      level: 'Beginner',
      category: 'Ballet',
      description: 'Test class created via API',
      schedule: {
        day: 'Monday',
        time: '10:00'
      }
    };

    console.log('🧪 Testing class creation...');
    console.log('📦 Data:', JSON.stringify(classData, null, 2));

    const response = await fetch('http://localhost:3000/api/classes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(classData)
    });

    const result = await response.json();
    console.log('📋 Response Status:', response.status);
    console.log('📋 Response:', JSON.stringify(result, null, 2));

    if (response.ok && result.success) {
      console.log('✅ Class created successfully!');
      
      // Now test fetching classes
      console.log('\n🧪 Testing class fetch...');
      const fetchResponse = await fetch('http://localhost:3000/api/classes');
      const fetchResult = await fetchResponse.json();
      console.log('📋 Classes count:', fetchResult.classes?.length || 0);
      
      // Clean up - delete the test class
      if (result.class && result.class._id) {
        console.log('\n🧪 Cleaning up test class...');
        const deleteResponse = await fetch(`http://localhost:3000/api/classes/${result.class._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const deleteResult = await deleteResponse.json();
        console.log('🗑️ Delete result:', deleteResult.success ? 'Success' : 'Failed');
      }
    } else {
      console.log('❌ Class creation failed');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testClassCreation();