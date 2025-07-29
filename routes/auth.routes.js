const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth');
const { register, login, getMe, logout } = require('../controllers/auth.controller')

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/getMe', authMiddleware, getMe);
router.post('/logout', authMiddleware, logout);

module.exports = router;