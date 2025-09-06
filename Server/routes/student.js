const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Route for submitting an assignment
router.post('/submit', studentController.submitAssignment);

module.exports = router;