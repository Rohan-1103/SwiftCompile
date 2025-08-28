// Import the Express router
const express = require('express');
const router = express.Router();

// Import authentication controller functions
const authController = require('../controllers/auth.controller');
// Import the JWT verification middleware
const verifyToken = require('../middleware/auth.middleware');

// Define authentication routes

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
router.post('/register', authController.register);

/**
 * @route POST /api/auth/login
 * @description Authenticate user & get token
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @route GET /api/auth/me
 * @description Get logged in user's data
 * @access Private
 */
router.get('/me', verifyToken, authController.getMe);

// Export the router to be used in the main application file (server.js)
module.exports = router;