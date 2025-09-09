import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentPage from './pages/StudentPage';
import TeacherPage from './pages/TeacherPage';

const App: React.FC = () => {
  return (
    <Router>
      <div>
    
        <Routes>
          <Route path="/student" element={<StudentPage />} />
          <Route path="/teacher" element={<TeacherPage />} />
          <Route path="/" element={
            <>
              <h2>Welcome! Please select a page:</h2>
              <ul>
                <li><a href="/student">Student Submission</a></li>
                
              </ul>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;