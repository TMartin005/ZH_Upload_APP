const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '../uploads');

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