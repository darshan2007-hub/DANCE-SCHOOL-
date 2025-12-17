const express = require('express');
const { login, getDashboard, getUsers, deleteUser } = require('../controllers/adminController');
const { adminProtect } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.get('/dashboard', adminProtect, getDashboard);
router.get('/users', adminProtect, getUsers);
router.delete('/users/:id', adminProtect, deleteUser);

module.exports = router;