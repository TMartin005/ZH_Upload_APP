const express = require('express');
require('dotenv').config();
const fileUpload = require('express-fileupload');
const cors = require('cors');
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');
const zhRoutes = require('./routes/zh_types');
const authRoutes = require('./routes/auth');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));
app.use(express.static(path.join(__dirname, 'uploads'), { extensions: ['c', 'cpp', 'py', 'csv'], index: false }));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/zh_types', zhRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});