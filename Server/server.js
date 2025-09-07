const express = require('express');

const fileUpload = require('express-fileupload');
const cors = require('cors');
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');
const zhRoutes = require('./routes/zh_types');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));
app.use(express.static(path.join(__dirname, 'uploads'), { extensions: ['c', 'cpp', 'csv'], index: false }));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/zh_types', zhRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});