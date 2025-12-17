const Class = require('../models/Class');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.getAllClasses = async (req, res) => {
  try {
    console.log('🔍 GET ALL CLASSES - Request received');
    console.log('🔗 MongoDB connection state:', require('mongoose').connection.readyState);
    
    const classes = await Class.find().populate('enrolledStudents', 'name email');
    console.log('📚 Classes found:', classes.length);
    
    res.json({
      success: true,
      classes
    });
  } catch (error) {
    console.error('🔥 GET CLASSES ERROR:', error.message);
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id).populate('enrolledStudents', 'name email');
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json({
      success: true,
      class: classData
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createClass = async (req, res) => {
  try {
    console.log('➕ CREATE CLASS - Request received');
    console.log('📋 Data:', req.body);
    console.log('👤 Admin ID:', req.admin?.id);
    
    const classData = await Class.create(req.body);
    console.log('✅ Class created successfully:', classData.name);
    
    res.status(201).json({
      success: true,
      class: classData
    });
  } catch (error) {
    console.error('🔥 CREATE CLASS ERROR:', error.message);
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.updateClass = async (req, res) => {
  try {
    console.log('✏️ UPDATE CLASS - Request received');
    console.log('📋 Class ID:', req.params.id);
    console.log('👤 Admin ID:', req.admin?.id);
    
    const classData = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!classData) {
      return res.status(404).json({ 
        success: false,
        message: 'Class not found' 
      });
    }
    
    console.log('✅ Class updated successfully:', classData.name);
    res.json({
      success: true,
      class: classData
    });
  } catch (error) {
    console.error('🔥 UPDATE CLASS ERROR:', error.message);
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    console.log('🗑️ DELETE CLASS - Request received');
    console.log('📋 Class ID:', req.params.id);
    console.log('👤 Admin ID:', req.admin?.id);
    console.log('🔗 MongoDB connection state:', require('mongoose').connection.readyState);
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('❌ Invalid ObjectId format');
      return res.status(400).json({ 
        success: false,
        message: 'Invalid class ID format' 
      });
    }
    
    // First check if class exists
    const existingClass = await Class.findById(req.params.id);
    if (!existingClass) {
      console.log('❌ Class not found in database');
      return res.status(404).json({ 
        success: false,
        message: 'Class not found' 
      });
    }
    
    console.log('🔍 Found class to delete:', existingClass.name);
    
    // Now delete it
    const classData = await Class.findByIdAndDelete(req.params.id);
    
    console.log('✅ Class deleted successfully:', classData.name);
    res.status(200).json({
      success: true,
      message: 'Class deleted successfully',
      deletedClass: {
        id: classData._id,
        name: classData.name
      }
    });
  } catch (error) {
    console.error('🔥 DELETE CLASS ERROR:', {
      message: error.message,
      stack: error.stack,
      id: req.params.id
    });
    res.status(500).json({ 
      success: false,
      message: 'Internal server error: ' + error.message 
    });
  }
};

exports.enrollInClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = req.user.id;

    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    if (classData.enrolledStudents.includes(userId)) {
      return res.status(400).json({ message: 'Already enrolled in this class' });
    }

    if (classData.enrolledStudents.length >= classData.capacity) {
      return res.status(400).json({ message: 'Class is full' });
    }

    classData.enrolledStudents.push(userId);
    await classData.save();

    const user = await User.findById(userId);
    user.enrolledClasses.push(classId);
    await user.save();

    res.json({
      success: true,
      message: 'Successfully enrolled in class'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};