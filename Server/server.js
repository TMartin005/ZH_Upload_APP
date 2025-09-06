const express = require('express');

const cors = require('cors');
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});