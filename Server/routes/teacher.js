const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

// Route to get all student submissions
router.get('/submissions', teacherController.getAllSubmissions);


// Export the router
module.exports = router;