'use strict';
const express = require('express');
const router = express.Router();
const { loginPage, login, register, logout, getMe } = require('../controllers/authController');
const { protect, guestOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/login', guestOnly, loginPage);
router.post('/login', guestOnly, login);
router.post('/register', guestOnly, register);
router.post('/logout', logout);

// Private routes
router.get('/me', protect, getMe);

module.exports = router;