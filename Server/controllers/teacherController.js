const fs = require('fs');
const path = require('path');

// Path to the uploads directory
const uploadsDir = path.join(__dirname, '../uploads');

// Function to get all submissions for the teacher
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
exports.getSubmissionByStudent = (req, res) => {
    const { neptun } = req.params;
    const submissions = [];

    try {
        const assignments = fs.readdirSync(uploadsDir);
        assignments.forEach(assignment => {
            const assignmentPath = path.join(uploadsDir, assignment);
            const files = fs.readdirSync(assignmentPath);
            files.forEach(file => {
                if (file.includes(`_${neptun}_`)) {
                    submissions.push({
                        assignment,
                        fileName: file
                    });
                }
            });
        });

        if (submissions.length === 0) {
            return res.status(404).json({ message: 'No submissions found for this student.' });
        }

        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Error reading submissions.' });
    }
};