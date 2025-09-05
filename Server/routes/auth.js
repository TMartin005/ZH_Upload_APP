const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for teacher login
router.post('/login', authController.loginTeacher);

module.exports = router;