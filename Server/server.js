const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');
const zhRoutes = require('./routes/zh_types');
const authRoutes = require('./routes/auth');
const path = require('path');
const { env } = require('process');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));
app.use(express.static(path.join(__dirname, 'uploads'), { extensions: ['c', 'cpp', 'csv'], index: false }));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/zh_types', zhRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/file/:assignment/:folder/:filename', (req, res) => {
    const { assignment, folder, filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', assignment, folder, filename);
    res.sendFile(filePath, err => {
        if (err) {
            res.status(404).send('File not found');
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(env.JWT_SECRET);
});