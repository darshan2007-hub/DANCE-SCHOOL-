const express = require('express');
const {
  createQuery,
  getAllQueries,
  getQueryById,
  respondToQuery,
  deleteQuery
} = require('../controllers/queryController');
const { adminProtect } = require('../middleware/auth');

const router = express.Router();

router.post('/', createQuery);
router.get('/', adminProtect, getAllQueries);
router.get('/:id', adminProtect, getQueryById);
router.put('/:id/respond', adminProtect, respondToQuery);
router.delete('/:id', adminProtect, deleteQuery);

module.exports = router;