const express = require('express');
const {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  enrollInClass
} = require('../controllers/classController');
const { protect, adminProtect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllClasses);
router.get('/:id', getClassById);
router.post('/', adminProtect, createClass);
router.put('/:id', adminProtect, updateClass);
router.delete('/:id', adminProtect, deleteClass);
router.post('/:classId/enroll', protect, enrollInClass);

module.exports = router;