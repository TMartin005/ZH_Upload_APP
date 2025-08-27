const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

// Route to get all student submissions
router.get('/submissions', teacherController.getAllSubmissions);

// Route to get a specific student's submission by name and Neptun code
router.get('/submissions/:name/:neptun', teacherController.getSubmissionByStudent);

// Export the router
module.exports = router;