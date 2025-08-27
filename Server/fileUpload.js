const multer = require('multer');
const path = require('path');

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const assignmentFolder = req.body.assignment; // Get the assignment name from the request
        const dir = path.join(__dirname, '../uploads', assignmentFolder);
        cb(null, dir); // Set the destination to the assignment folder
    },
    filename: (req, file, cb) => {
        const studentName = req.body.name.replace(/\s+/g, '_'); // Replace spaces with underscores
        const neptunCode = req.body.neptunCode;
        const assignmentName = req.body.assignment;
        const fileExtension = path.extname(file.originalname);
        
        // Construct the filename
        const filename = `${studentName}_${neptunCode}_${assignmentName}${fileExtension}`;
        cb(null, filename); // Set the filename
    }
});

// Filter for allowed file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = /(\.c|\.cpp|\.csv)$/; // Allowed file extensions
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (isValid) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only .c, .cpp, and .csv files are allowed.'), false); // Reject the file
    }
};

// Initialize multer with the storage and file filter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// Export the upload middleware
module.exports = upload;