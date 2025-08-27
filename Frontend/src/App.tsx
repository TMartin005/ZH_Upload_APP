import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentForm from './components/StudentForm';
import TeacherForm from './components/TeacherForm';
import './App.css';
function App() {
  return (
    <Router>
      <div className="App">
        <h1>Assignment Submission App</h1>
        <Routes>
          <Route path="/student" element={<StudentForm />} />
          <Route path="/teacher" element={<TeacherForm />} />
          <Route path="/" element={
            <>
              <h2>Welcome! Please choose your role:</h2>
              <div>
                <a href="/student">Student</a>
                <a href="/teacher">Teacher</a>
              </div>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}


export default App
