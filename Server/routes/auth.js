const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for teacher login
router.post('/login', authController.loginTeacher);

router.get('/auth_test', (req, res) => {
  res.json({ message: 'Auth route works!' });
});
module.exports = router;