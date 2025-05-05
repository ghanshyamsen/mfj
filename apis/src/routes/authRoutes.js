const express = require('express');
const router = express.Router();
const Auth = require('../app/controllers/auth/authController');

// Create an instance of the class
const authInstance = new Auth();

// Define routes
router.post('/login', authInstance.login);
router.get('/register', authInstance.register);
router.post('/forgot-password', authInstance.forgetpassword);
router.patch('/reset-password/:key', authInstance.resetpassword);

module.exports = router;