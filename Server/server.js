const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static('uploads'));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});