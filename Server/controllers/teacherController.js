const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const uploadsDir = path.join(__dirname, '../uploads');
const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD || "asd123"; // Store your password securely

exports.getAllSubmissions = (req, res) => {
    fs.readdir(uploadsDir, async (err, assignments) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading submissions directory' });
        }

        const submissions = {};

        try {
            await Promise.all(assignments.map(async assignment => {
                const assignmentPath = path.join(uploadsDir, assignment);
                const files = await fs.promises.readdir(assignmentPath);
                submissions[assignment] = files.map(file => {
                    const [studentName, neptunCode, , ...rest] = file.split('_');
                    return {
                        studentName,
                        neptunCode,
                        fileName: file,
                        assignment: assignment,
                        additionalFile: rest.join('_') || null
                    };
                });
            }));

            res.status(200).json(submissions);
        } catch (error) {
            res.status(500).json({ message: 'Error reading assignment folder' });
        }
    });
};

exports.loginTeacher = (req, res) => {
    const { password } = req.body;

    if (password === TEACHER_PASSWORD) {
        const token = jwt.sign({ role: 'teacher' }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
        return res.status(200).json({ token });
    }

    return res.status(401).json({ message: 'Invalid password' });
};