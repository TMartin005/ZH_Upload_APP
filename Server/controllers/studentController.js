const fs = require('fs');
const path = require('path');

// Directory for uploads
const uploadsDir = path.join(__dirname, '../uploads');

// Function to handle student assignment submission
exports.submitAssignment = (req, res) => {
    const { name, neptunCode, assignmentName, wroteCode, aiAcknowledgment } = req.body;
    const files = req.files;

    if (!name || !neptunCode || !assignmentName || !files || files.length === 0) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const assignmentFolder = path.join(uploadsDir, assignmentName);
    
    // Create assignment folder if it doesn't exist
    if (!fs.existsSync(assignmentFolder)) {
        fs.mkdirSync(assignmentFolder, { recursive: true });
    }

    // Generate file names
    const mainFile = `${name}_${neptunCode}_${assignmentName}${path.extname(files[0].originalname)}`;
    const additionalFile = files.length > 1 ? `${name}_${neptunCode}_${assignmentName}_${files[1].originalname}` : null;

    // Move files to the appropriate directory
    const mainFilePath = path.join(assignmentFolder, mainFile);
    fs.renameSync(files[0].path, mainFilePath);

    if (additionalFile) {
        const additionalFilePath = path.join(assignmentFolder, additionalFile);
        fs.renameSync(files[1].path, additionalFilePath);
    }

    return res.status(200).json({ message: 'Assignment submitted successfully.' });
};

// Function to retrieve the last submission for a student
exports.getLastSubmission = (req, res) => {
    const { name, neptunCode, assignmentName } = req.query;

    const assignmentFolder = path.join(uploadsDir, assignmentName);
    if (!fs.existsSync(assignmentFolder)) {
        return res.status(404).json({ message: 'No submissions found for this assignment.' });
    }

    const files = fs.readdirSync(assignmentFolder);
    const studentFiles = files.filter(file => file.startsWith(`${name}_${neptunCode}`));

    if (studentFiles.length === 0) {
        return res.status(404).json({ message: 'No submissions found for this student.' });
    }

    const lastSubmission = studentFiles[studentFiles.length - 1];
    return res.status(200).json({ lastSubmission });
};