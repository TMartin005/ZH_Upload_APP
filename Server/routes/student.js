const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Route for submitting an assignment
router.post('/submit', studentController.submitAssignment);

// Route for retrieving the last submission by a student
router.get('/submission/:neptun', studentController.getLastSubmission);

/* // Route for editing a submission
router.put('/edit/:neptun', studentController.editSubmission); */

module.exports = router;