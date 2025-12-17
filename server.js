const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const queryRoutes = require('./routes/queryRoutes');
const classRoutes = require('./routes/classRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5175', 
    'http://localhost:4000', 
    'http://localhost:3000',
    'https://cosmic-blini-fa572c.netlify.app'
  ],
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Serve static files from React build (for production)
app.use(express.static(path.join(__dirname, '../dance/dist')));

// Serve static files from public directory
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/danceschool', {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
  maxPoolSize: 10
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database:', mongoose.connection.name);
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('🔄 Retrying connection in 5 seconds...');
    setTimeout(() => {
      mongoose.connect(process.env.MONGODB_URI).catch(() => {
        console.log('⚠️ Server continuing without database...');
      });
    }, 5000);
  });

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API info route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Dance School API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth (POST /login, /signup)',
      admin: '/api/admin (POST /login)',
      queries: '/api/queries (GET, POST)',
      classes: '/api/classes (GET, POST)'
    }
  });
});

// Test route to list all classes
app.get('/api/test-classes', async (req, res) => {
  try {
    const Class = require('./models/Class');
    const classes = await Class.find({}, '_id name');
    res.json({ success: true, classes, count: classes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Database connection test route
app.get('/api/test-db', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected', 
      2: 'connecting',
      3: 'disconnecting'
    };
    
    // Test query creation
    const Query = require('./models/Query');
    const testQuery = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Test message for database connection'
    };
    
    const result = await Query.create(testQuery);
    await Query.findByIdAndDelete(result._id); // Clean up test data
    
    res.json({
      success: true,
      database: {
        state: states[dbState],
        connected: dbState === 1,
        uri: process.env.MONGODB_URI ? 'Set' : 'Not set'
      },
      test: 'Database write/read test passed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      database: {
        state: mongoose.connection.readyState,
        error: error.message
      }
    });
  }
});

// Simple delete route for testing
app.delete('/api/classes-simple/:id', async (req, res) => {
  try {
    console.log('🧪 SIMPLE DELETE TEST - ID:', req.params.id);
    const Class = require('./models/Class');
    const result = await Class.findByIdAndDelete(req.params.id);
    console.log('🧪 SIMPLE DELETE RESULT:', result ? 'Found and deleted' : 'Not found');
    if (result) {
      res.json({ success: true, message: 'Class deleted', deletedClass: result.name });
    } else {
      res.status(404).json({ success: false, message: 'Class not found' });
    }
  } catch (error) {
    console.log('🧪 SIMPLE DELETE ERROR:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/classes', classRoutes);

// Root route for development
app.get('/', (req, res) => {
  res.json({ 
    message: 'Dance School API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    note: 'API is deployed and ready',
    endpoints: {
      auth: '/api/auth (POST /login, /signup)',
      admin: '/api/admin (POST /login)',
      queries: '/api/queries (GET, POST)',
      classes: '/api/classes (GET, POST)'
    }
  });
});

// Catch-all route for unmatched requests
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
