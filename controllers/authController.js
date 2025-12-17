const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: '30d'
  });
};

exports.signup = async (req, res) => {
  try {
    console.log('🔍 SIGNUP - Request received');
    console.log('📦 Body:', req.body);
    console.log('🔗 MongoDB connection state:', require('mongoose').connection.readyState);

    const { name, email, password, phone, dateOfBirth } = req.body;

    if (!name || !email || !password) {
      console.log('❌ Validation failed - missing required fields');
      return res.status(400).json({ 
        success: false,
        message: 'Name, email, and password are required',
        received: { name: !!name, email: !!email, password: !!password }
      });
    }

    console.log('🔍 Checking for existing user...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    console.log('✅ Creating new user...');
    const userData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: phone ? phone.trim() : undefined,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined
    };
    
    console.log('📝 User data to save:', { ...userData, password: '[HIDDEN]' });

    const user = await User.create(userData);
    
    console.log('🎉 User created successfully:', user._id);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('🔥 SIGNUP ERROR:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('🔍 LOGIN - Request received');
    console.log('📦 Body:', { email: req.body.email, password: '[HIDDEN]' });
    console.log('🔗 MongoDB connection state:', require('mongoose').connection.readyState);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Validation failed - missing credentials');
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    console.log('🔍 Finding user by email...');
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    console.log('🔍 Comparing password...');
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password for user:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    console.log('✅ Login successful for user:', user._id);
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('🔥 LOGIN ERROR:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('enrolledClasses');
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        enrolledClasses: user.enrolledClasses
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};