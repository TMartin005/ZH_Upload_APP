const fs = require('fs');
const path = require('path');

// Path to the uploads directory
const uploadsDir = path.join(__dirname, '../uploads');

// Function to get all submissions for the teacher
exports.getAllSubmissions = (req, res) => {
    fs.readdir(uploadsDir, (err, assignments) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading submissions directory' });
        }

        const submissions = {};

        // Read each assignment folder
        assignments.forEach(assignment => {
            const assignmentPath = path.join(uploadsDir, assignment);
            fs.readdir(assignmentPath, (err, files) => {
                if (err) {
                    return res.status(500).json({ message: 'Error reading assignment folder' });
                }

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
            });
        });

        // Send the submissions back to the teacher
        res.status(200).json(submissions);
    });
};