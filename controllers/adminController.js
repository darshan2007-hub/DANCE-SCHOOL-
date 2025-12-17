const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Class = require('../models/Class');
const Query = require('../models/Query');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: '30d'
  });
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(admin._id);

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalClasses = await Class.countDocuments();
    const totalQueries = await Query.countDocuments();
    const pendingQueries = await Query.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalClasses,
        totalQueries,
        pendingQueries
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('enrolledClasses').sort({ createdAt: -1 });
    res.json({
      success: true,
      users
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};