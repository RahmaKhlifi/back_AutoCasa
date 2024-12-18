const express = require('express');
const router = express.Router();
const { getUserStats } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware
router.use(authMiddleware);

// Get user stats
router.get('/stats', getUserStats);

module.exports = router; 