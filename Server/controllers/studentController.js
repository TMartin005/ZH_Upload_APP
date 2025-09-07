const fs = require('fs');
const path = require('path');
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

     // Generate main file name and folder
    const mainFileName = `${name}_${neptunCode}_${assignment}${path.extname(mainFile.name)}`;
    const mainFileBase = path.basename(mainFileName, path.extname(mainFileName));
    const extraFolder = path.join(assignmentFolder, mainFileBase);

    // Create folder for this submission if it doesn't exist
    if (!fs.existsSync(extraFolder)) {
        fs.mkdirSync(extraFolder, { recursive: true });
    }

    // Path for main file inside its folder
    const mainFilePath = path.join(extraFolder, mainFileName);

    // Move main file
    mainFile.mv(mainFilePath, (err) => {
        if (err) {
            console.error('Error saving main file:', err);
            return res.status(500).json({ message: 'Error saving main file.' });
        }

        // Move additional file if present
        if (additionalFile) {
            const additionalFilePath = path.join(extraFolder, additionalFile.name);
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