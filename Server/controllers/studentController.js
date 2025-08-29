const fs = require('fs');
const path = require('path');

// Directory for uploads
const uploadsDir = path.join(__dirname, '../uploads');

// Function to handle student assignment submission
exports.submitAssignment = (req, res) => {
    console.log('req.files:', req.files);
    const { name, neptunCode, assignment } = req.body;
    const wroteCode = req.body.wroteCode;
    const aiAcknowledgment = req.body.aiAcknowledgment;
    const mainFile = req.files?.file;
    const additionalFile = req.files?.additionalFile;

    // Log incoming request
    console.log('Incoming submission:', { name, neptunCode, assignment, mainFile, additionalFile });

    if (!name || !neptunCode || !assignment || !mainFile) {
        return res.status(400).json({ message: 'All fields are required and file must be uploaded.' });
    }

    const assignmentFolder = path.join(uploadsDir, assignment);

    // Create assignment folder if it doesn't exist
    if (!fs.existsSync(assignmentFolder)) {
        fs.mkdirSync(assignmentFolder, { recursive: true });
    }

    // Generate file names
    const mainFileName = `${name}_${neptunCode}_${assignment}${path.extname(mainFile.name)}`;
    const mainFilePath = path.join(assignmentFolder, mainFileName);

    // Move main file
    mainFile.mv(mainFilePath, (err) => {
        if (err) {
            console.error('Error saving main file:', err);
            return res.status(500).json({ message: 'Error saving main file.' });
        }

        // Move additional file if present
        if (additionalFile) {
            const additionalFileName = `${name}_${neptunCode}_${assignment}_${additionalFile.name}`;
            const additionalFilePath = path.join(assignmentFolder, additionalFileName);
            additionalFile.mv(additionalFilePath, (err) => {
                if (err) {
                    console.error('Error saving additional file:', err);
                    return res.status(500).json({ message: 'Error saving additional file.' });
                }
                return res.status(200).json({ message: 'Assignment submitted successfully.' });
            });
        } else {
            return res.status(200).json({ message: 'Assignment submitted successfully.' });
        }
    });
  
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