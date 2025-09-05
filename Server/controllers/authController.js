const jwt = require('jsonwebtoken');

const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD || 'asd123'; // Store your password securely

// Function to handle teacher login
exports.loginTeacher = (req, res) => {
    const { password } = req.body;

    if (password !== TEACHER_PASSWORD) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ role: 'teacher' }, process.env.JWT_SECRET || 'asd123', { expiresIn: '1h' });

    res.status(200).json({ token });
};